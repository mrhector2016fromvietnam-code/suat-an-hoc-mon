import { MealPackage, DayMenu, CateringClient, DispatchTrip, FoodSafetySample, DailyMealAdjustment } from '../types/catering';

export const MEAL_PACKAGES: MealPackage[] = [
  {
    id: 'cong-nhan-tiet-kiem',
    name: 'Gói Công Nhân Tiêu Chuẩn',
    code: 'CN-22K',
    price: 22000,
    targetAudience: 'Nhà máy dệt may, cơ khí vừa, bao bì, giày da',
    caloriesTarget: 780,
    proteinTarget: 28,
    description: 'Thực đơn no chắc bụng, đảm bảo năng lượng làm việc liên tục. Cơm gạo thơm dẻo và canh nóng tiếp thêm không giới hạn.',
    features: [
      '1 Món đạm chính (Thịt kho trứng, Cá chiên xù, Gà sốt...)',
      '1 Món xào đậm đà (Rau muống tỏi, Cải thìa dầu hào)',
      '1 Món canh tươi thanh nhiệt (Canh bầu, Canh mồng tơi)',
      'Cơm trắng dẻo & nước canh tiếp thêm miễn phí',
      'Tráng miệng chuối laba hoặc dưa hấu mát lành',
      'Đựng khay inox 5 ngăn nắp kín hoặc chia tại chỗ'
    ],
    image: '/src/assets/images/meal_tray_industrial_1791218594110.jpg',
    badgeText: 'Tiết Kiệm Tối Ưu'
  },
  {
    id: 'cong-nhan-nang-luong',
    name: 'Gói Công Nhân Năng Lượng Cao',
    code: 'CN-28K',
    price: 28000,
    targetAudience: 'Xí nghiệp cơ khí nặng, đúc ép kim loại, chế biến gỗ Hóc Môn',
    caloriesTarget: 950,
    proteinTarget: 36,
    description: 'Bổ sung hàm lượng protein cao và calo dồi dào, tái tạo sức lao động nhanh chóng cho công nhân ca nặng và ca tăng cường.',
    features: [
      '1 Món đạm chủ lực định lượng lớn (Sườn ram mặn, Đùi gà chiên mắm)',
      '1 Món phụ tăng đạm (Trứng ốp la, Chả cá sốt cà)',
      '1 Món rau củ VietGAP xào thịt/tôm khô',
      '1 Canh chua cá bớp hoặc canh sườn hầm củ dền',
      'Tráng miệng sữa chua tươi hoặc cam Hưng Yên',
      'Vận chuyển bằng thùng giữ nhiệt điện tử >68°C'
    ],
    image: '/src/assets/images/meal_tray_industrial_1791218594110.jpg',
    badgeText: 'Bán Chạy Nhất'
  },
  {
    id: 'van-phong-ky-su',
    name: 'Gói Văn Phòng & Kỹ Sư Công Nghệ',
    code: 'VP-35K',
    price: 35000,
    targetAudience: 'Nhân viên khối văn phòng KCN, kỹ sư nhà máy, chuyên viên kiểm hàng',
    caloriesTarget: 720,
    proteinTarget: 32,
    description: 'Chế độ ăn thanh nhẹ, ít dầu mỡ, cân đối rau xanh VietGAP và thực phẩm giàu Omega-3, trình bày khay Inox 304 cao cấp.',
    features: [
      'Món chính phong phú (Bò lúc lắc, Cá hồi áp chảo sốt me, Gà nướng mật ong)',
      'Salad dầu giấm hoặc rau củ luộc chấm kho quẹt',
      'Canh rong biển đậu hũ hoặc Canh súp gà ngô non',
      'Cơm gạo lứt huyết rồng hoặc gạo ST25 thượng hạng',
      'Tráng miệng trái cây 4 mùa hoặc chè dưỡng nhan',
      'Kèm khăn lạnh tiệt trùng và tăm nha khoa riêng'
    ],
    image: '/src/assets/images/meal_tray_industrial_1791218594110.jpg',
    badgeText: 'Cao Cấp Văn Phòng'
  },
  {
    id: 'hoc-duong-ban-tru',
    name: 'Gói Dinh Dưỡng Bán Trú Học Đường',
    code: 'HD-32K',
    price: 32000,
    targetAudience: 'Trường tiểu học, trung học cơ sở và mầm non bán trú huyện Hóc Môn',
    caloriesTarget: 650,
    proteinTarget: 26,
    description: 'Thực đơn xây dựng theo tiêu chuẩn Viện Dinh Dưỡng Quốc Gia. Vị ngon thanh dịu, không xương dăm, kích thích sự phát triển trí não và chiều cao.',
    features: [
      'Thịt xay nhồi đậu sốt cà, Đùi gà roti mềm dễ tiêu',
      'Canh bí đỏ thịt bằm, Canh cải bó xôi ngọt mát',
      'Rau củ cắt hạt lựu luộc màu sắc bắt mắt',
      'Hộp sữa chua men sống Vinamilk / TH True Milk',
      'Mẫu thức ăn lưu 48 giờ nghiêm ngặt trong tủ lạnh chuyên dụng',
      'Không dùng bột ngọt hóa học, 100% hạt nêm từ củ quả'
    ],
    image: '/src/assets/images/school_catering_tray_1791218620156.jpg',
    badgeText: 'Chuẩn Bộ Y Tế'
  },
  {
    id: 'chuyen-gia-cao-cap',
    name: 'Gói Chuyên Gia & Ban Giám Đốc',
    code: 'VIP-55K',
    price: 55000,
    targetAudience: 'Chuyên gia nước ngoài, ban lãnh đạo doanh nghiệp, khách đối tác',
    caloriesTarget: 800,
    proteinTarget: 42,
    description: 'Khẩu phần đặc biệt phục vụ bàn theo tiêu chuẩn nhà hàng, nguyên liệu tuyển chọn cao cấp cùng set đồ ăn sứ hoặc khay mạ vàng.',
    features: [
      'Bò Úc sốt tiêu đen, Tôm sú rim nước dừa, Mực hấp gừng',
      'Canh súp bào ngư nấm đông cô hoặc Canh sườn hầm atiso',
      'Rau củ ngũ sắc xào hạt điều',
      'Cơm niêu thơm lừng hoặc Bánh mì bơ tỏi ăn kèm',
      'Trái cây nhập khẩu (Nho Mỹ, Táo Envy, Kiwi)',
      'Phục vụ nhân viên tiếp thực tận phòng riêng'
    ],
    image: '/src/assets/images/meal_tray_industrial_1791218594110.jpg',
    badgeText: 'VIP Doanh Nghiệp'
  },
  {
    id: 'chay-thanh-dam',
    name: 'Gói Chay Thanh Tịnh & Thực Dưỡng',
    code: 'CH-25K',
    price: 25000,
    targetAudience: 'Công nhân ăn chay ngày Rằm, mùng Một, người ăn thực dưỡng',
    caloriesTarget: 680,
    proteinTarget: 24,
    description: 'Nguyên liệu từ nấm rơm Hóc Môn, đậu hũ tươi sạch, đạm thực vật nguyên chất, gia vị tự nhiên không chất bảo quản.',
    features: [
      'Nấm đùi gà kho tiêu, Đậu hũ nhồi nấm mèo sốt cà chua',
      'Chả lụa chay rim mè, Sườn non chay chiên giòn',
      'Canh rong biển đậu non hoặc Canh sen hạt sen táo đỏ',
      'Rau củ luộc chấm chao chùa Hóc Môn',
      'Tráng miệng chuối nếp hoặc chè đậu xanh cốt dừa',
      'Khu vực chế biến bếp chay riêng biệt 100%'
    ],
    image: '/src/assets/images/meal_tray_industrial_1791218594110.jpg',
    badgeText: 'Ăn Chay Thanh Lạc'
  }
];

export const WEEKLY_MENUS: DayMenu[] = [
  {
    id: 'menu-t2-trua',
    dayOfWeek: 'Thứ 2',
    dateStr: '06/10/2026',
    shift: 'Trưa',
    packageId: 'cong-nhan-tiet-kiem',
    packageName: 'Gói Công Nhân Tiêu Chuẩn',
    mainDish: 'Thịt Ba Rọi Kho Trứng Cút Đậm Đà',
    secondaryDish: 'Đậu Hũ Chiên Giòn Chấm Nước Mắm Tỏi',
    soup: 'Canh Bầu Nấu Tôm Khô Thanh Mát',
    stirFry: 'Rau Muống Xào Tỏi Xanh Mướt',
    dessert: 'Chuối Laba Tây Nguyên (1 Trái)',
    specialNote: 'Cơm gạo thơm dẻo và canh tiếp thêm tự do',
    totalKcal: 820,
    proteinG: 30,
    carbsG: 110,
    fatG: 24,
    allergens: ['Trứng cút', 'Tôm khô'],
    imageUrl: '/src/assets/images/meal_tray_industrial_1791218594110.jpg'
  },
  {
    id: 'menu-t3-trua',
    dayOfWeek: 'Thứ 3',
    dateStr: '07/10/2026',
    shift: 'Trưa',
    packageId: 'cong-nhan-tiet-kiem',
    packageName: 'Gói Công Nhân Tiêu Chuẩn',
    mainDish: 'Cá Nục Nhật Sốt Cà Ri Chua Ngọt',
    secondaryDish: 'Trứng Bằm Chiên Hành Lá Thơm Phức',
    soup: 'Canh Cải Ngọt Nấu Thịt Nạc Thơm Lành',
    stirFry: 'Bắp Cải Trắng Xào Cà Rốt Sợi',
    dessert: 'Dưa Hấu Long An Tươi Ngọt (2 Lát)',
    specialNote: 'Cá được làm sạch ruột và hấp chín kỹ trước khi sốt',
    totalKcal: 790,
    proteinG: 29,
    carbsG: 105,
    fatG: 22,
    allergens: ['Cá biển', 'Trứng gà'],
    imageUrl: '/src/assets/images/meal_tray_industrial_1791218594110.jpg'
  },
  {
    id: 'menu-t4-trua',
    dayOfWeek: 'Thứ 4',
    dateStr: '08/10/2026',
    shift: 'Trưa',
    packageId: 'cong-nhan-tiet-kiem',
    packageName: 'Gói Công Nhân Tiêu Chuẩn',
    mainDish: 'Đùi Gà Tươi Chiên Nước Mắm Tỏi Ớt',
    secondaryDish: 'Chả Cá Basa Chiên Cốm Giòn Rụm',
    soup: 'Canh Mướp Hương Nấu Mồng Tơi & Cua Đồng',
    stirFry: 'Giá Hẹ Xào Huyết Heo Tươi Sạch',
    dessert: 'Ổi Lê Hóc Môn Xắt Miếng Chấm Muối Ớt',
    specialNote: 'Gà tươi CP chứng nhận nguồn gốc xuất kho sáng sớm',
    totalKcal: 860,
    proteinG: 34,
    carbsG: 108,
    fatG: 26,
    allergens: ['Cua đồng', 'Cá basa'],
    imageUrl: '/src/assets/images/meal_tray_industrial_1791218594110.jpg'
  },
  {
    id: 'menu-t5-trua',
    dayOfWeek: 'Thứ 5',
    dateStr: '09/10/2026',
    shift: 'Trưa',
    packageId: 'cong-nhan-tiet-kiem',
    packageName: 'Gói Công Nhân Tiêu Chuẩn',
    mainDish: 'Sườn Heo Cốt Lết Ram Mặn Ngọt Kiểu Nam Bộ',
    secondaryDish: 'Đậu Que Xào Thịt Nạc Xắt Lát',
    soup: 'Canh Bí Xanh Hầm Xương Heo Đậm Đà',
    stirFry: 'Rau Cải Thìa Xào Dầu Hào Thơm Béo',
    dessert: 'Thơm (Dứa) Chín Cây Gọt Sẵn',
    specialNote: 'Sườn cốt lết được ướp mật ong tự nhiên mềm thịt',
    totalKcal: 840,
    proteinG: 32,
    carbsG: 112,
    fatG: 25,
    allergens: ['Dầu hào'],
    imageUrl: '/src/assets/images/meal_tray_industrial_1791218594110.jpg'
  },
  {
    id: 'menu-t6-trua',
    dayOfWeek: 'Thứ 6',
    dateStr: '10/10/2026',
    shift: 'Trưa',
    packageId: 'cong-nhan-tiet-kiem',
    packageName: 'Gói Công Nhân Tiêu Chuẩn',
    mainDish: 'Cá Ba Sa Kho Tộ Nước Hàng Thơm Cay Nhẹ',
    secondaryDish: 'Thịt Heo Xào Mắm Ruốc Huế & Sả Ớt',
    soup: 'Canh Chua Nam Bộ Bạc Hà & Giá Đỗ',
    stirFry: 'Bông Cải Trắng Xào Cà Chua',
    dessert: 'Thanh Long Ruột Đỏ Chợ Đầu Mối Hóc Môn',
    specialNote: 'Canh chua thanh dịu giải nhiệt ca làm việc nóng',
    totalKcal: 810,
    proteinG: 28,
    carbsG: 104,
    fatG: 23,
    allergens: ['Mắm ruốc', 'Cá basa'],
    imageUrl: '/src/assets/images/meal_tray_industrial_1791218594110.jpg'
  },
  {
    id: 'menu-t7-trua',
    dayOfWeek: 'Thứ 7',
    dateStr: '11/10/2026',
    shift: 'Trưa',
    packageId: 'cong-nhan-tiet-kiem',
    packageName: 'Gói Công Nhân Tiêu Chuẩn',
    mainDish: 'Bò Xào Cần Tây Hành Tây Sa Tế Mềm Ngon',
    secondaryDish: 'Trứng Ốp La Lòng Đào Tiêu Thơm',
    soup: 'Canh Xà Lách Xoong Nấu Thịt Heo Băm',
    stirFry: 'Đậu Bắp Luộc Chấm Chao Béo Ngậy',
    dessert: 'Cam Sành Vắt Tươi Hoặc Sữa Chua',
    specialNote: 'Thực đơn cuối tuần bổ sung năng lượng hồi phục',
    totalKcal: 850,
    proteinG: 35,
    carbsG: 102,
    fatG: 24,
    allergens: ['Thịt bò', 'Chao đậu'],
    imageUrl: '/src/assets/images/meal_tray_industrial_1791218594110.jpg'
  }
];

export const CATERING_CLIENTS: CateringClient[] = [
  {
    id: 'client-01',
    name: 'Công Ty May Mặc Tân Thới Hiệp',
    industry: 'Gia công hàng dệt may xuất khẩu',
    zone: 'KCN Tân Thới Hiệp',
    address: 'Đường Dương Thị Mười, P. Hiệp Thành / Giáp Hóc Môn',
    contactPerson: 'Bà Nguyễn Thị Mai (Trưởng phòng Hành chính - Nhân sự)',
    phone: '0903 881 294',
    activePackageId: 'cong-nhan-tiet-kiem',
    standardPortions: {
      lunch: 850,
      dinner: 420,
      night: 90,
      vegetarian: 45
    },
    contractValidUntil: '31/12/2027',
    ratingAvg: 4.8
  },
  {
    id: 'client-02',
    name: 'Xí Nghiệp Cơ Khí Nhị Xuân',
    industry: 'Gia công kết cấu thép & đột dập kim loại',
    zone: 'Cụm CN Nhị Xuân',
    address: 'Đường Nguyễn Văn Bứa, Xã Xuân Thới Sơn, H. Hóc Môn',
    contactPerson: 'Ông Trần Quốc Thắng (Quản đốc điều hành xưởng)',
    phone: '0918 334 712',
    activePackageId: 'cong-nhan-nang-luong',
    standardPortions: {
      lunch: 520,
      dinner: 280,
      night: 110,
      vegetarian: 20
    },
    contractValidUntil: '15/08/2027',
    ratingAvg: 4.9
  },
  {
    id: 'client-03',
    name: 'Trường Tiểu Học Xuân Thới Thượng',
    industry: 'Giáo dục công lập bán trú',
    zone: 'Khu Dân Cư & Trường Học Hóc Môn',
    address: 'Đường Phan Văn Hớn, Xã Xuân Thới Thượng, H. Hóc Môn',
    contactPerson: 'Thầy Lê Hoàng Nam (Phó Hiệu Trưởng Phụ Trách Bán Trú)',
    phone: '0982 455 190',
    activePackageId: 'hoc-duong-ban-tru',
    standardPortions: {
      lunch: 780,
      dinner: 0,
      night: 0,
      vegetarian: 15
    },
    contractValidUntil: '30/06/2027',
    ratingAvg: 5.0
  },
  {
    id: 'client-04',
    name: 'Công Ty Chế Biến Gỗ Bà Điểm',
    industry: 'Sản xuất nội thất gỗ công nghiệp',
    zone: 'KCN Bà Điểm',
    address: 'Khu công nghiệp Bà Điểm, Hóc Môn, TP.HCM',
    contactPerson: 'Ông Đặng Minh Vũ (Giám đốc Sản xuất)',
    phone: '0937 662 189',
    activePackageId: 'cong-nhan-nang-luong',
    standardPortions: {
      lunch: 430,
      dinner: 190,
      night: 0,
      vegetarian: 25
    },
    contractValidUntil: '20/11/2026',
    ratingAvg: 4.7
  },
  {
    id: 'client-05',
    name: 'Công Ty Điện Tử & Linh Kiện Vĩnh Lộc',
    industry: 'Lắp ráp bảng mạch vi điện tử SMT',
    zone: 'KCN Vĩnh Lộc',
    address: 'Lô C7 KCN Vĩnh Lộc, giáp ranh Hóc Môn & Bình Chánh',
    contactPerson: 'Chị Phạm Thùy Linh (Ban Chấp hành Công đoàn)',
    phone: '0908 554 321',
    activePackageId: 'van-phong-ky-su',
    standardPortions: {
      lunch: 650,
      dinner: 310,
      night: 80,
      vegetarian: 50
    },
    contractValidUntil: '01/04/2028',
    ratingAvg: 4.9
  }
];

export const DISPATCH_TRIPS_TODAY: DispatchTrip[] = [
  {
    id: 'DISP-HM-01',
    clientName: 'Công Ty May Mặc Tân Thới Hiệp',
    zone: 'KCN Tân Thới Hiệp',
    shift: 'Trưa',
    totalPortions: 895,
    vegetarianPortions: 45,
    driverName: 'Bác Nguyễn Văn Tài (Tài xế 12 năm kinh nghiệm)',
    driverPhone: '0909 234 561',
    vehiclePlate: '51D - 482.91 (Xe tải chuyên dụng 2.5T có giàn giữ nhiệt)',
    dispatchTime: '10:30',
    deliveryTime: '11:15',
    hotBoxTemp: 71.5,
    status: 'Đã giao & Ký nhận',
    receivedBy: 'Đoàn kiểm thực May Tân Thới Hiệp - Ký số lúc 11:18',
    sampleSealCode: 'SEAL-20261005-01'
  },
  {
    id: 'DISP-HM-02',
    clientName: 'Trường Tiểu Học Xuân Thới Thượng',
    zone: 'Khu Dân Cư & Trường Học Hóc Môn',
    shift: 'Trưa',
    totalPortions: 780,
    vegetarianPortions: 15,
    driverName: 'Anh Trần Hữu Phước',
    driverPhone: '0938 119 443',
    vehiclePlate: '51C - 991.04 (Xe chuyên dụng cấp đông & giữ nóng 1.8T)',
    dispatchTime: '10:15',
    deliveryTime: '10:55',
    hotBoxTemp: 73.0,
    status: 'Đã giao & Ký nhận',
    receivedBy: 'Cô Thảo - Quản lý Bán Trú Trường Tiểu Học',
    sampleSealCode: 'SEAL-20261005-02'
  },
  {
    id: 'DISP-HM-03',
    clientName: 'Xí Nghiệp Cơ Khí Nhị Xuân',
    zone: 'Cụm CN Nhị Xuân',
    shift: 'Trưa',
    totalPortions: 540,
    vegetarianPortions: 20,
    driverName: 'Anh Huỳnh Quốc Bảo',
    driverPhone: '0912 654 890',
    vehiclePlate: '51D - 633.28 (Xe tải giữ nhiệt thùng inox 304)',
    dispatchTime: '10:45',
    deliveryTime: '11:25',
    hotBoxTemp: 69.8,
    status: 'Đang vận chuyển nhiệt',
    sampleSealCode: 'SEAL-20261005-03'
  },
  {
    id: 'DISP-HM-04',
    clientName: 'Công Ty Điện Tử & Linh Kiện Vĩnh Lộc',
    zone: 'KCN Vĩnh Lộc',
    shift: 'Trưa',
    totalPortions: 700,
    vegetarianPortions: 50,
    driverName: 'Anh Võ Văn Sơn',
    driverPhone: '0977 888 123',
    vehiclePlate: '51D - 772.19 (Xe bảo ôn chuyên dụng)',
    dispatchTime: '10:40',
    deliveryTime: '11:30',
    hotBoxTemp: 70.2,
    status: 'Đang vận chuyển nhiệt',
    sampleSealCode: 'SEAL-20261005-04'
  },
  {
    id: 'DISP-HM-05',
    clientName: 'Công Ty Chế Biến Gỗ Bà Điểm',
    zone: 'KCN Bà Điểm',
    shift: 'Chiều',
    totalPortions: 190,
    vegetarianPortions: 25,
    driverName: 'Anh Trần Hữu Phước',
    driverPhone: '0938 119 443',
    vehiclePlate: '51C - 991.04',
    dispatchTime: '16:00',
    deliveryTime: '16:45',
    hotBoxTemp: 72.0,
    status: 'Chờ đóng khay',
    sampleSealCode: 'SEAL-20261005-05'
  }
];

export const FOOD_SAFETY_SAMPLES_TODAY: FoodSafetySample[] = [
  {
    id: 'SMP-202610-01',
    date: '06/10/2026',
    mealShift: 'Trưa',
    menuSummary: 'Thịt ba rọi kho trứng cút, Canh bầu tôm khô, Rau muống xào tỏi, Cơm dẻo',
    storageCabinet: 'Tủ Mát Lưu Mẫu Chuyên Dụng T-01 (Phòng KCS)',
    cabinetTemp: 3.8,
    inspectorName: 'Kỹ Sư VSATTP Trần Thị Kim Ngân (Chứng chỉ HACCP Lead Auditor)',
    sealNumber: 'TEM-NIEMPHONG-99812A',
    supplierProof: 'Thịt heo CP Chợ Đầu Mối Hóc Môn (HĐ #8841), Rau HTX VietGAP Tân Phú Trung Củ Chi (Lô #VG-249)',
    retentionHours: 24,
    status: 'Đang lưu mẫu an toàn',
    notes: 'Lưu đủ 150g mỗi món trong thố inox tiệt trùng 100°C có dán tem niêm phong ngày giờ theo Quyết định 1246/QĐ-BYT.'
  },
  {
    id: 'SMP-202610-02',
    date: '06/10/2026',
    mealShift: 'Trưa',
    menuSummary: 'Thịt bằm viên sốt cà, Canh súp cà rốt khoai tây, Đậu cô ve xào thịt, Sữa chua Vinamilk (Suất Học Đường)',
    storageCabinet: 'Tủ Mát Lưu Mẫu Bán Trú Học Sinh T-02',
    cabinetTemp: 4.2,
    inspectorName: 'Bác Sĩ Dinh Dưỡng Lê Văn Dũng & Ban Giám Sát Phụ Huynh',
    sealNumber: 'TEM-NIEMPHONG-99813B',
    supplierProof: 'Thịt sạch Vissan Hóc Môn, Sữa chua nhập kho có hồ sơ công bố chất lượng',
    retentionHours: 48,
    status: 'Đang lưu mẫu an toàn',
    notes: 'Thực đơn trường học tuân thủ lưu mẫu 48 giờ mở rộng phục vụ đoàn thanh tra y tế học đường.'
  },
  {
    id: 'SMP-202610-03',
    date: '05/10/2026',
    mealShift: 'Chiều',
    menuSummary: 'Gà kho gừng, Canh bí đỏ thịt bằm, Cải bẹ xanh luộc chấm nước tương',
    storageCabinet: 'Tủ Mát Lưu Mẫu Chuyên Dụng T-01',
    cabinetTemp: 3.6,
    inspectorName: 'Kỹ Sư VSATTP Trần Thị Kim Ngân',
    sealNumber: 'TEM-NIEMPHONG-99780C',
    supplierProof: 'Gà thả vườn Long An - Giấy kiểm dịch số #0921/TY-HCM',
    retentionHours: 24,
    status: 'Đã nghiệm thu hoàn tất',
    notes: 'Hết 24h lưu mẫu, hủy mẫu an toàn theo đúng biên bản khử trùng sinh học.'
  }
];

export const INITIAL_ADJUSTMENTS: DailyMealAdjustment[] = [
  {
    id: 'ADJ-1001',
    clientId: 'client-01',
    clientName: 'Công Ty May Mặc Tân Thới Hiệp',
    date: '06/10/2026',
    lunchCount: 895,
    dinnerCount: 420,
    nightCount: 90,
    vegetarianCount: 45,
    specialDietNotes: 'Tăng 45 suất ca trưa cho công nhân chuyền may 4 tăng ca đột xuất. Yêu cầu thêm 1 thùng cơm phụ.',
    status: 'Đã xác nhận',
    submittedAt: '08:15 Sáng nay',
    totalEstimatedCost: 31900000
  },
  {
    id: 'ADJ-1002',
    clientId: 'client-02',
    clientName: 'Xí Nghiệp Cơ Khí Nhị Xuân',
    date: '06/10/2026',
    lunchCount: 540,
    dinnerCount: 280,
    nightCount: 110,
    vegetarianCount: 20,
    specialDietNotes: 'Giữ ấm thùng giữ nhiệt trên 70 độ C cho đội thợ nguội ăn trưa đợt 2 lúc 11h45.',
    status: 'Đang nấu',
    submittedAt: '08:30 Sáng nay',
    totalEstimatedCost: 26040000
  }
];
