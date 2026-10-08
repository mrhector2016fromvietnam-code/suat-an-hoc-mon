export interface VendorInfo {
  id: string;
  name: string;
  code: string;
  aliases: string[];
}

export const VENDOR_REGISTRY: VendorInfo[] = [
  { id: 'tam-phuong', name: 'Tám Phương', code: 'TP', aliases: ['tam phuong', 'tám phương', 'tp', 'cty tam phuong', 'suat an tam phuong'] },
  { id: 'lim-duong', name: 'Lim Dương', code: 'LD', aliases: ['lim duong', 'lim dương', 'ld', 'cty lim duong', 'suat an lim duong'] },
  { id: 'minh-long-food', name: 'Minh Long Food', code: 'ML', aliases: ['minh long', 'minh long food', 'ml', 'minhlong', 'suat an minh long'] },
  { id: 'nguyen-sai-gon', name: 'Nguyên Sài Gòn', code: 'NS', aliases: ['nguyen sai gon', 'nguyên sài gòn', 'ns', 'nguyen sai', 'suat an nguyen sai gon'] },
  { id: 'huong-ngoc-phat', name: 'Hương Ngọc Phát', code: 'HN', aliases: ['huong ngoc phat', 'hương ngọc phát', 'hn', 'huong ngoc', 'suat an huong ngoc phat'] },
  { id: 'thien-hong-phuc', name: 'Thiên Hồng Phúc', code: 'TH', aliases: ['thien hong phuc', 'thiên hồng phúc', 'th', 'thien hong', 'suat an thien hong phuc'] },
  { id: 'vina-story', name: 'Vina Story', code: 'VS', aliases: ['vina story', 'vinastory', 'vs', 'cty vina story'] },
];

/**
 * Strips Vietnamese diacritics / accents
 */
export function stripAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Calculates Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Fuzzy matches supplier name from file header, sheet name, or file title
 */
export function matchSupplierFromText(text: string): VendorInfo | null {
  if (!text) return null;
  const clean = stripAccents(text);

  // Exact alias match or word boundary match first
  for (const vendor of VENDOR_REGISTRY) {
    for (const alias of vendor.aliases) {
      const aliasClean = stripAccents(alias);

      // Check word boundary match e.g. "NCC: TP" or "LIM DUONG"
      if (aliasClean.length <= 2) {
        const regex = new RegExp(`(?:ncc|cty|ma|code|nha cung cap)[:\\s]*\\b${aliasClean}\\b`, 'i');
        if (regex.test(clean)) return vendor;
      } else if (clean.includes(aliasClean)) {
        return vendor;
      }
    }
  }

  // Levenshtein fuzzy match <= 2 for words >= 5 chars
  const words = clean.split(/\s+/).filter((w) => w.length >= 4);
  for (const word of words) {
    for (const vendor of VENDOR_REGISTRY) {
      for (const alias of vendor.aliases) {
        const aliasClean = stripAccents(alias);
        if (aliasClean.length >= 4 && Math.abs(word.length - aliasClean.length) <= 2) {
          if (levenshteinDistance(word, aliasClean) <= 2) {
            return vendor;
          }
        }
      }
    }
  }

  return null;
}

export interface SupplierMatchResult {
  supplier: VendorInfo;
  source: 'user_selected' | 'header_fuzzy_match' | 'fallback_default';
  isConflict: boolean;
  conflictDetails?: {
    userSelected: VendorInfo;
    fileDetected: VendorInfo;
    message: string;
  };
}

/**
 * Resolves final supplier following Priority order & Conflict Detection
 */
export function resolveSupplierMatch(
  userSelectedVendorId: string | 'auto' | 'all',
  fileTextContent: string = ''
): SupplierMatchResult {
  const detected = matchSupplierFromText(fileTextContent);
  const userVendorObj = VENDOR_REGISTRY.find((v) => v.id === userSelectedVendorId);

  // Case 1: User explicitly picked a specific vendor in UI (and not 'auto' / 'all')
  if (userVendorObj && userSelectedVendorId !== 'auto' && userSelectedVendorId !== 'all') {
    if (detected && detected.id !== userVendorObj.id) {
      return {
        supplier: userVendorObj,
        source: 'user_selected',
        isConflict: true,
        conflictDetails: {
          userSelected: userVendorObj,
          fileDetected: detected,
          message: `File này có vẻ thuộc về ${detected.name} (${detected.code}), nhưng bạn đang chọn ${userVendorObj.name} (${userVendorObj.code}). Đồng bộ vào nhà cung cấp nào?`,
        },
      };
    }
    return {
      supplier: userVendorObj,
      source: 'user_selected',
      isConflict: false,
    };
  }

  // Case 2: Auto detection from file text
  if (detected) {
    return {
      supplier: detected,
      source: 'header_fuzzy_match',
      isConflict: false,
    };
  }

  // Case 3: Default fallback
  const defaultVendor = VENDOR_REGISTRY[0]; // Tâm Phương
  return {
    supplier: defaultVendor,
    source: 'fallback_default',
    isConflict: false,
  };
}

/**
 * Step D requirement: Unique record key for every shift entry
 * format: supplierId + weekStart + date + shift
 */
export function getShiftUniqueKey(supplierId: string, weekStart: string, date: string, shift: string): string {
  return `${supplierId}_${weekStart}_${date}_${shift}`.toLowerCase().replace(/\s+/g, '_');
}
