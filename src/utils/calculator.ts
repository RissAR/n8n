import {
  AddonKey,
  CalculationBreakdown,
  EngineeringType,
  LutskDistrict,
  PropertyType,
  RepairScope,
  RepairType,
  RoomType,
} from '../types/quiz';

export const REPAIR_RATES: Record<RepairType, { title: string; pricePerM2: number; desc: string }> = {
  cosmetic: {
    title: 'Косметичний',
    pricePerM2: 3500,
    desc: 'Оновлення оздоблення, фарбування, шпалери, ламінат',
  },
  capital: {
    title: 'Капітальний',
    pricePerM2: 7500,
    desc: 'Стяжка, штукатурка, перепланування, чорнові роботи',
  },
  designer: {
    title: 'Дизайнерський «під ключ»',
    pricePerM2: 13500,
    desc: 'Авторський нагляд, преміум-матеріали, повний цикл',
  },
};

export const PROPERTY_MULTIPLIERS: Record<PropertyType, { title: string; multiplier: number; desc: string }> = {
  new: {
    title: 'Новобудова',
    multiplier: 1.0,
    desc: 'Чистовий стан після забудовника (коефіцієнт x1.0)',
  },
  secondary: {
    title: 'Вторинне житло',
    multiplier: 1.2,
    desc: 'Демонтаж старих покриттів та комунікацій (коефіцієнт x1.2)',
  },
};

export const ROOM_RATES: Record<RoomType, { title: string; price: number; isPerM2: boolean; desc: string }> = {
  bathroom: {
    title: 'Ванна / Санвузол під ключ',
    price: 25000,
    isPerM2: false,
    desc: 'Гідроізоляція, розводка труб, монтаж інсталяції, плитка',
  },
  kitchen: {
    title: 'Кухня під ключ',
    price: 18000,
    isPerM2: false,
    desc: 'Фартух плитки, виводи під техніку, розетки, чистове оздоблення',
  },
  bedroom: {
    title: 'Кімната / Спальня',
    price: 3500,
    isPerM2: true,
    desc: 'Вирівнювання стін, ламінат, плінтуси, освітлення',
  },
  balcony: {
    title: 'Балкон під ключ',
    price: 14000,
    isPerM2: false,
    desc: 'Утеплення, обшивка, тепла підлога, скління або оздоблення',
  },
};

export const ENGINEERING_RATES: Record<EngineeringType, { title: string; price: number; isPerM2: boolean; desc: string }> = {
  electric: {
    title: 'Електромонтаж під ключ',
    price: 15000,
    isPerM2: false,
    desc: 'Штроблення, щиток, автомати, розведення кабелів по кімнатах',
  },
  plumbing: {
    title: 'Сантехніка під ключ',
    price: 12000,
    isPerM2: false,
    desc: 'Монтаж гребінки, точки підключення, каналізація, редуктори',
  },
  tile: {
    title: 'Укладання плитки',
    price: 600,
    isPerM2: true,
    desc: 'Керамограніт, запил під 45°, епоксидна або цементна затирка',
  },
};

export const ADDONS_DATA: Record<AddonKey, { title: string; price: number; desc: string }> = {
  dismantling: {
    title: 'Демонтаж та вивіз будсміття по Луцьку',
    price: 6000,
    desc: 'Збивання старої штукатурки, демонтаж перегородок, власний транспорт',
  },
  materials_procurement: {
    title: 'Закупівля матеріалів зі знижкою до 20% в Епіцентрі Луцьк',
    price: 4000,
    desc: 'Партнерська дисконтна картка майстра, перевірка якості та доставка',
  },
  design_supervision: {
    title: '3D-візуалізація та технічний план комунікацій',
    price: 10000,
    desc: 'Точне планування розеток, вимикачів, розкладка меблів та плитки',
  },
};

export const DISTRICTS_DATA: Record<LutskDistrict, { title: string; note: string }> = {
  center: {
    title: 'Центр / Старе місто',
    note: 'Швидкий виїзд за 30 хв',
  },
  district_33_40: {
    title: '33-й / 40-й квартал',
    note: 'Соборності, Відродження, Конякіна, Гордіюк',
  },
  lpz: {
    title: 'ЛПЗ / ДПЗ',
    note: 'Гнідава, Дружби Народів, Потебні',
  },
  kovelska: {
    title: 'Володимирська / Ковельська / Чернишевського',
    note: 'Червоного Хреста, Ківерцівська',
  },
  suburb: {
    title: 'Передмістя (до 15 км)',
    note: 'Струмівка, Боратин, Липини, Зміїнець, Підгайці тощо',
  },
};

export const formatUAH = (amount: number): string => {
  return `${amount.toLocaleString('uk-UA')} грн`;
};

export const calculateEstimate = (
  scope: RepairScope,
  repairType: RepairType,
  roomType: RoomType,
  engineeringType: EngineeringType,
  propertyType: PropertyType,
  areaM2: number,
  addons: AddonKey[]
): CalculationBreakdown => {
  let baseCost = 0;
  let itemDescription = '';

  if (scope === 'whole_flat') {
    const rate = REPAIR_RATES[repairType]?.pricePerM2 || 3500;
    const multiplier = PROPERTY_MULTIPLIERS[propertyType]?.multiplier || 1.0;
    baseCost = Math.round(areaM2 * rate * multiplier);
    itemDescription = `${REPAIR_RATES[repairType]?.title || ''} (${areaM2} м²)`;
  } else if (scope === 'single_room') {
    const room = ROOM_RATES[roomType];
    if (room?.isPerM2) {
      baseCost = Math.round(areaM2 * room.price);
      itemDescription = `${room.title} (${areaM2} м²)`;
    } else {
      baseCost = room?.price || 25000;
      itemDescription = `${room?.title || ''} (під ключ)`;
    }
  } else if (scope === 'engineering') {
    const eng = ENGINEERING_RATES[engineeringType];
    if (eng?.isPerM2) {
      baseCost = Math.round(areaM2 * eng.price);
      itemDescription = `${eng.title} (${areaM2} м²)`;
    } else {
      baseCost = eng?.price || 15000;
      itemDescription = `${eng?.title || ''} (під ключ)`;
    }
  }

  let addonsTotal = 0;
  addons.forEach((key) => {
    if (ADDONS_DATA[key]) {
      addonsTotal += ADDONS_DATA[key].price;
    }
  });

  const totalAmount = baseCost + addonsTotal;

  return {
    baseCost,
    addonsTotal,
    totalAmount,
    totalFormatted: formatUAH(totalAmount),
    itemDescription,
  };
};
