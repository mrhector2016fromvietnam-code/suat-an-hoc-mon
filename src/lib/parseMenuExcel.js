// parseMenuExcel.mjs
// Parser XÁC ĐỊNH (không dùng AI) cho file thực đơn suất ăn dạng:
//   Sheet mặn : cột Thứ | SÁNG(Món, Trọng lượng) | TRƯA(...) | TỐI(...)
//   Sheet chay: cùng bố cục nhưng lệch cột (bắt đầu từ cột A)
// Chạy được cả trình duyệt lẫn Node. Phụ thuộc: npm i xlsx
import * as XLSX from 'xlsx';

/* ---------- 1. Tiện ích chuỗi ---------- */
export const clean = (v) =>
  String(v ?? '').normalize('NFC').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

export const stripVi = (s) =>
  String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/đ/g, 'd').replace(/\s+/g, ' ').trim();

const sentenceCase = (s) => {
  const t = clean(s);
  if (!t) return t;
  const letters = t.replace(/[^\p{L}]/gu, '');
  const base = letters && letters === letters.toUpperCase() ? t.toLowerCase() : t;
  return base.charAt(0).toUpperCase() + base.slice(1);
};

/* ---------- 2. Nhà cung cấp ---------- */
// Lưu ý: file thật ghi "TÁM PHƯƠNG", app ghi "Tâm Phương" -> so khớp KHÔNG dấu để không lệch.
export const SUPPLIERS = [
  { id: 'TP', name: 'Tâm Phương',      aliases: ['tam phuong', 'tamphuong', 'tp'] },
  { id: 'LD', name: 'Lim Dương',       aliases: ['lim duong', 'limduong', 'ld'] },
  { id: 'ML', name: 'Minh Long Food',  aliases: ['minh long', 'minh long food', 'minhlong', 'ml'] },
  { id: 'NS', name: 'Nguyên Sài Gòn',  aliases: ['nguyen sai gon', 'nguyensaigon', 'nguyen sai', 'ns'] },
  { id: 'HN', name: 'Hương Ngọc Phát', aliases: ['huong ngoc phat', 'huongngocphat', 'huong ngoc', 'hn'] },
  { id: 'TH', name: 'Thiên Hồng Phúc', aliases: ['thien hong phuc', 'thienhongphuc', 'thien hong', 'th'] },
  { id: 'VS', name: 'Vina Story',      aliases: ['vina story', 'vinastory', 'vs'] },
];

export function matchSupplier(texts, suppliers = SUPPLIERS) {
  for (const raw of texts) {
    if (!raw) continue;
    const t = stripVi(raw).replace(/[_\-.]+/g, ' ');
    const tCompact = t.replace(/\s+/g, '');
    for (const s of suppliers) {
      for (const a of s.aliases) {
        const aNorm = stripVi(a);
        const aCompact = aNorm.replace(/\s+/g, '');
        if (t.includes(aNorm) || tCompact.includes(aCompact)) {
          return { id: s.id, name: s.name, matchedBy: raw };
        }
      }
    }
  }
  return null;
}

/* ---------- 3. Tách định lượng ---------- */
// "Thịt heo 45-50gr ,Khoai tây 40gr" -> [{label:'Thịt heo',min:45,max:50,unit:'g'},{label:'Khoai tây',min:40,max:40,unit:'g'}]
const UNITS = 'gram|gr|g|ml|cái|quả|con|trứng|ổ|hủ|bịch|lát|miếng|cục|viên|phần|hộp|ly|chén|cuốn|cuộn|cây|hũ|món';
const QTY_RE = new RegExp(
  `(\\d+(?:[.,]\\d+)?)(?:\\s*[-–—~]\\s*(\\d+(?:[.,]\\d+)?))?(?:\\s*(${UNITS})(?![\\p{L}]))?`, 'giu');
const num = (s) => parseFloat(String(s).replace(',', '.'));
const normUnit = (u) => (!u ? null : /^(gram|gr|g)$/i.test(u) ? 'g' : u.toLowerCase());
const trimPunct = (s) => clean(s).replace(/^[\s,;+:\-–]+|[\s,;+:\-–]+$/g, '');

export function parseQuantity(raw) {
  let text = clean(raw);
  const notes = [];
  // "( gram )" chỉ là chú thích đơn vị -> bỏ; ngoặc khác (vd "(2 con)") -> thành ghi chú
  text = text.replace(/\(([^)]*)\)/g, (_, inner) => {
    if (!/^\s*gram?\s*$/i.test(inner) && clean(inner)) notes.push(clean(inner));
    return ' ';
  });
  const portions = [];
  let last = 0, m;
  QTY_RE.lastIndex = 0;
  while ((m = QTY_RE.exec(text))) {
    const min = num(m[1]);
    const max = m[2] ? num(m[2]) : min;
    portions.push({
      label: trimPunct(text.slice(last, m.index)),
      min: Math.min(min, max), max: Math.max(min, max), unit: normUnit(m[3]),
    });
    last = m.index + m[0].length;
  }
  // thiếu đơn vị (vd "bò 40~45, rau 30-35 gram") -> mượn đơn vị khối lượng của phần sau
  for (let i = 0; i < portions.length; i++) {
    if (portions[i].unit) continue;
    const isW = (p) => p.unit === 'g' || p.unit === 'ml';
    const src = portions.slice(i + 1).find(isW) || portions.slice(0, i).reverse().find(isW);
    if (src) { portions[i].unit = src.unit; portions[i].assumedUnit = true; }
  }
  const trailing = trimPunct(text.slice(last));
  if (trailing && portions.length) notes.push(trailing);
  return { portions, note: notes.join('; '), parsed: portions.length > 0, raw: clean(raw) };
}

/* ---------- 4. Đọc lưới ô (toạ độ tuyệt đối, không lệch do ô gộp) ---------- */
function sheetToGrid(ws) {
  if (!ws['!ref']) return [];
  const rng = XLSX.utils.decode_range(ws['!ref']);
  const grid = [];
  for (let r = 0; r <= rng.e.r; r++) {
    const row = [];
    for (let c = 0; c <= rng.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      row.push(cell ? clean(cell.w ?? cell.v) : '');
    }
    grid.push(row);
  }
  return grid;
}

function findHeader(grid) {
  for (let r = 0; r < Math.min(grid.length, 30); r++) {
    const row = grid[r].map(stripVi);
    const hasWord = (cell, words) => words.some(w => cell.includes(w));
    const sang = row.findIndex((x) => hasWord(x, ['sang']));
    const trua = row.findIndex((x) => hasWord(x, ['trua']));
    const toi = row.findIndex((x) => hasWord(x, ['toi', 'chieu', 'dem', 'toi tang ca']));
    if (sang >= 0 && trua >= 0 && toi >= 0) {
      const starts = [sang, trua, toi].sort((a, b) => a - b);
      const groupCols = (start) => {
        const next = starts.find((x) => x > start) ?? start + 3;
        const sub = (grid[r + 1] || []).map(stripVi);
        let nameCol = start, weightCol = start + 1;
        for (let c = start; c < next; c++) {
          if (sub[c]?.includes('mon') || sub[c]?.includes('ten')) nameCol = c;
          if (sub[c]?.includes('trong luong') || sub[c]?.includes('dinh luong') || sub[c]?.includes('khoi luong') || sub[c]?.includes('so luong')) weightCol = c;
        }
        return { nameCol, weightCol };
      };
      let dayCol = row.findIndex((x) => x.includes('thu') || x.includes('ngay'));
      if (dayCol < 0) dayCol = starts[0] - 1;
      return { r, dayCol, sang: groupCols(sang), trua: groupCols(trua), toi: groupCols(toi) };
    }
  }
  return null;
}

/* ---------- 5. Tách món ---------- */
function makeItem(rawName, rawWeight) {
  let name = clean(rawName), note = '';
  const m = name.match(/^(.*?)\s*:\s*(\d.*)$/); // "Thạch rau câu: 1 hủ"
  if (m) { name = m[1]; note = m[2]; }
  const q = parseQuantity(rawWeight);
  return {
    name: sentenceCase(name),
    note: [note, q.note].filter(Boolean).join('; '),
    portions: q.portions,
    rawName: clean(rawName),
    rawWeight: clean(rawWeight),
    ...(q.parsed || !clean(rawWeight) ? {} : { unparsed: true }),
  };
}

// Trưa/Tối: mỗi dòng 1 món. Phân loại theo vị trí + từ khoá:
//   canh / cơm theo từ khoá; mọi thứ sau 'Cơm' là tráng miệng; còn lại là 'main' (mặn + rau, giữ nguyên thứ tự).
function parseLunchDinner(rows, cols) {
  const items = [];
  for (const row of rows) {
    const name = row[cols.nameCol], w = row[cols.weightCol];
    if (!name && !w) continue;
    if (!name && items.length) { // dòng phụ chỉ có trọng lượng -> nối vào món trước
      const prev = items[items.length - 1];
      Object.assign(prev, makeItem(prev.rawName, `${prev.rawWeight} ${w}`));
      continue;
    }
    items.push(makeItem(name, w));
  }
  const iCanh = items.findIndex((i) => /^canh\b/.test(stripVi(i.name)));
  const iCom = items.findIndex((i) => /^com\b/.test(stripVi(i.name)));
  items.forEach((it, i) => {
    it.category =
      i === iCanh ? 'canh'
      : i === iCom ? 'com'
      : iCom >= 0 && i > iCom ? 'trang_mieng'
      : 'main';
  });
  return items;
}

// Sáng: ô "Món" gộp nhiều dòng = 1 món; cột trọng lượng liệt kê thành phần từng dòng.
function parseBreakfast(rows, cols) {
  const dishes = [];
  let cur = null;
  const newDish = (rawName) => {
    cur = { category: 'sang', name: sentenceCase(rawName), note: '', portions: [],
            rawName: clean(rawName), rawWeight: '' };
    dishes.push(cur);
  };
  for (const row of rows) {
    const name = row[cols.nameCol], w = row[cols.weightCol];
    if (name) newDish(name);
    if (w) {
      if (!cur) newDish('');
      const q = parseQuantity(w);
      if (q.parsed) cur.portions.push(...q.portions);
      else cur.portions.push({ label: sentenceCase(w), min: null, max: null, unit: null }); // vd "Sữa đậu nành"
      if (q.note) cur.note = [cur.note, q.note].filter(Boolean).join('; ');
      cur.rawWeight = [cur.rawWeight, clean(w)].filter(Boolean).join(' | ');
    }
  }
  return dishes;
}

/* ---------- 6. Ngày tháng ---------- */
const iso = (a) => `${a[3]}-${a[2].padStart(2, '0')}-${a[1].padStart(2, '0')}`;
export function parseWeek(text) {
  const m = [...String(text).matchAll(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})/g)];
  return m.length ? { start: iso(m[0]), end: m[1] ? iso(m[1]) : null } : null;
}
const addDays = (d, n) => {
  const x = new Date(`${d}T00:00:00Z`); x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};
const isMonday = (d) => new Date(`${d}T00:00:00Z`).getUTCDay() === 1;
const dayIndex = (label) => {
  const s = stripVi(label);
  if (s.includes('2') || s.includes('hai')) return 0;
  if (s.includes('3') || s.includes('ba')) return 1;
  if (s.includes('4') || s.includes('tu')) return 2;
  if (s.includes('5') || s.includes('nam')) return 3;
  if (s.includes('6') || s.includes('sau')) return 4;
  if (s.includes('7') || s.includes('bay')) return 5;
  if (s.includes('chu') || s.includes('nhat') || s.includes('cn')) return 6;
  return -1;
};

/* ---------- 7. HÀM CHÍNH ---------- */
/**
 * @param {ArrayBuffer|Uint8Array|Buffer} input  nội dung file .xlsx/.xls/.ods
 * @param {string} fileName                      dùng để đoán NCC
 * @param {{type?:string, supplierId?:string, weekStart?:string}} opts
 *   supplierId = NCC đang chọn trên giao diện (nguồn sự thật)
 *   weekStart  = Thứ 2 của tuần đang xem (YYYY-MM-DD). Nếu có, chỉ lấy sheet đúng tuần đó
 *                (file Vina chứa 16 sheet của nhiều tuần).
 */
export function parseMenuWorkbook(input, fileName = '', opts = {}) {
  const wb = XLSX.read(input, { type: opts.type ?? 'array' });
  const warnings = [];
  const skippedSheets = [];
  const records = [];
  const sheets = [];
  const weeksFound = new Set();
  let supplierRaw = '', project = '';

  for (const sheetName of wb.SheetNames) {
    const grid = sheetToGrid(wb.Sheets[sheetName]);
    const hdr = findHeader(grid);
    if (!hdr) { skippedSheets.push({ name: sheetName, reason: 'không có hàng SÁNG/TRƯA/TỐI' }); continue; }

    // --- tiêu đề phía trên bảng ---
    const titleCells = grid.slice(0, hdr.r).flat().filter(Boolean);
    let sheetWeek = null;
    for (const t of titleCells) {
      const n = stripVi(t);
      if (!supplierRaw && (/^ncc\s*:/.test(n) || /(^|\s)cong ty\b/.test(n) || SUPPLIERS.some((s) => s.aliases.some((a) => n.includes(stripVi(a))))) && !n.includes('dia chi'))
        supplierRaw = clean(t.replace(/^ncc\s*:\s*/i, ''));
      if (!project && n.startsWith('du an')) project = t;
      const w = parseWeek(t);
      if (w && (!sheetWeek || (!sheetWeek.end && w.end))) sheetWeek = w;
    }
    sheetWeek ||= parseWeek(sheetName); // dự phòng: tên sheet "05.10.2026-11.10.2026"
    if (!sheetWeek) { warnings.push(`Sheet "${sheetName}": không đọc được khoảng ngày, bỏ qua.`); continue; }
    weeksFound.add(sheetWeek.start);
    if (opts.weekStart && sheetWeek.start !== opts.weekStart) {
      skippedSheets.push({ name: sheetName, reason: `tuần ${sheetWeek.start} ≠ tuần đang chọn ${opts.weekStart}` });
      continue;
    }
    if (!isMonday(sheetWeek.start)) warnings.push(`Sheet "${sheetName}": ngày bắt đầu ${sheetWeek.start} không phải Thứ 2.`);

    const nonCompany = titleCells.filter((t) => !/cong ty|^ncc/.test(stripVi(t))).join(' ');
    const menuType = /\bchay\b/.test(stripVi(`${sheetName} ${nonCompany}`)) ? 'chay' : 'man';

    // --- chặn dưới: dòng chữ ký "NHÀ CUNG CẤP" ---
    let stop = grid.length;
    for (let r = hdr.r + 2; r < grid.length; r++) {
      if (grid[r].some((c) => stripVi(c).includes('nha cung cap'))) { stop = r; break; }
    }
    const starts = [];
    for (let r = hdr.r + 2; r < stop; r++) {
      const idx = dayIndex(grid[r][hdr.dayCol]);
      if (idx >= 0) starts.push({ r, idx, label: grid[r][hdr.dayCol] });
    }
    if (!starts.length) { warnings.push(`Sheet "${sheetName}": không thấy dòng "Thứ 2…Chủ nhật".`); continue; }
    if (starts.length !== 7) warnings.push(`Sheet "${sheetName}": thấy ${starts.length}/7 ngày.`);

    sheets.push({ name: sheetName, menuType, weekStart: sheetWeek.start, days: starts.length });
    starts.forEach((d, i) => {
      const end = Math.min((starts[i + 1]?.r ?? stop) - 1, d.r + 8); // 1 khối ngày ≤ 9 dòng
      const rows = grid.slice(d.r, end + 1);
      const date = addDays(sheetWeek.start, d.idx);
      const push = (shift, items) =>
        records.push({ weekStart: sheetWeek.start, date, weekday: d.label, weekdayIndex: d.idx, shift, menuType, sheet: sheetName, items });
      push('sang', parseBreakfast(rows, hdr.sang));
      push('trua', parseLunchDinner(rows, hdr.trua));
      push('toi', parseLunchDinner(rows, hdr.toi));
    });
  }

  if (!records.length) {
    warnings.push(opts.weekStart && weeksFound.size && !weeksFound.has(opts.weekStart)
      ? `File không có tuần ${opts.weekStart}. Các tuần trong file: ${[...weeksFound].sort().join(', ')}.`
      : 'Không đọc được thực đơn nào từ file.');
  } else if (!opts.weekStart && weeksFound.size > 1) {
    warnings.push(`File chứa ${weeksFound.size} tuần (${[...weeksFound].sort().join(', ')}). Hãy truyền weekStart để chọn tuần.`);
  }

  // --- khớp NCC: lựa chọn trên giao diện là nguồn sự thật; mâu thuẫn -> app phải hỏi lại ---
  const detected = matchSupplier([supplierRaw, fileName, ...wb.SheetNames]);
  const chosen = opts.supplierId ? SUPPLIERS.find((s) => s.id === opts.supplierId) : null;
  const supplierConflict = !!(detected && chosen && detected.id !== chosen.id);
  if (supplierConflict) warnings.push(`File có vẻ của "${detected.name}" nhưng đang chọn "${chosen.name}".`);
  if (!detected) warnings.push(`Không nhận ra NCC từ nội dung/tên file (đọc được: "${supplierRaw}").`);
  const supplier = chosen || detected;
  for (const r of records) r.key = `${supplier?.id ?? '?'}|${r.date}|${r.shift}|${r.menuType}`;

  // --- kiểm tra chất lượng ---
  for (const r of records) {
    const tag = `${r.weekday}/${r.shift}/${r.menuType}`;
    if (r.items.length < 1) { warnings.push(`${tag}: trống`); continue; }
    if (r.shift === 'sang') continue;
    const cats = r.items.map((i) => i.category);
    if (!cats.includes('canh')) warnings.push(`${tag}: không thấy món canh.`);
    if (!cats.includes('com')) warnings.push(`${tag}: không thấy món cơm.`);
    if (r.items.length < 5 || r.items.length > 9) warnings.push(`${tag}: có ${r.items.length} món (bất thường).`);
    r.items.filter((i) => i.unparsed).forEach((i) => warnings.push(`${tag}: không tách được định lượng "${i.rawWeight}" của "${i.name}".`));
  }

  return {
    supplier: supplier ? { ...supplier, raw: supplierRaw } : { id: null, name: null, raw: supplierRaw },
    detectedSupplier: detected, supplierConflict,
    project, weeksFound: [...weeksFound].sort(), sheets, skippedSheets, records, warnings,
    stats: { records: records.length, dishes: records.reduce((n, r) => n + r.items.length, 0) },
  };
}

/* ---------- 8. Hỗ trợ hiển thị ---------- */
const fmtRange = (p) =>
  p.min == null ? '' : `${p.min === p.max ? p.min : `${p.min}–${p.max}`}${!p.unit ? '' : p.unit === 'g' || p.unit === 'ml' ? p.unit : ` ${p.unit}`}`;
export const formatPortions = (item) =>
  item.portions.map((p) => [p.label, fmtRange(p)].filter(Boolean).join(' ')).join(' · ');

/** Gom records thành lưới UI: grid[date][shift] = { man:[], chay:[], trangMieng:[] } */
export function toGrid(records) {
  const g = {};
  for (const r of records) {
    const cell = ((g[r.date] ||= {})[r.shift] ||= { man: [], chay: [], trangMieng: [] });
    const main = r.items.filter((i) => i.category !== 'trang_mieng');
    cell[r.menuType === 'chay' ? 'chay' : 'man'] = main;
    const dessert = r.items.filter((i) => i.category === 'trang_mieng');
    if (dessert.length && (r.menuType === 'man' || !cell.trangMieng.length)) cell.trangMieng = dessert;
  }
  return g;
}

/**
 * Dùng cho nhánh ẢNH: Gemini chỉ cần chép lại từng dòng bảng đúng như in ("name","weight"),
 * còn tách định lượng + phân loại món do hàm này làm, giống hệt nhánh Excel.
 * rows: [{name, weight}] theo thứ tự dòng; ô gộp (Sáng) thì dòng tiếp theo để name = "".
 */
export function itemsFromRows(shift, rows) {
  const grid = rows.map((r) => [clean(r.name), clean(r.weight)]);
  const cols = { nameCol: 0, weightCol: 1 };
  return shift === 'sang' ? parseBreakfast(grid, cols) : parseLunchDinner(grid, cols);
}
