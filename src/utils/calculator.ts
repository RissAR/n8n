import { AddonKey, CalculationBreakdown, PropertyType, RepairType } from '../types/quiz';

export const REPAIR_RATES: Record<RepairType, { title: string; pricePerM2: number; desc: string }> = {
  cosmetic: {
    title: 'Косметичний',
    pricePerM2: 2500,
    desc: 'Оновлення оздоблення, шпалери, ламінат',
  },
  capital: {
    title: 'Капітальний',
    pricePerM2: 5000,
    desc: 'Стяжка, штукатурка, перепланування, чорнові роботи',
  },
  designer: {
    title: 'Дизайнерський «під ключ»',
    pricePerM2: 8500,
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
    multiplier: 1.25,
    desc: 'Демонтаж старих покриттів та комунікацій (коефіцієнт x1.25)',
  },
};

export const ADDONS_DATA: Record<AddonKey, { title: string; price: number; desc: string }> = {
  design_project: {
    title: 'Дизайн-проєкт',
    price: 15000,
    desc: '3D-візуалізація, креслення комунікацій та підбір матеріалів',
  },
  electric_plumbing: {
    title: 'Сантехніка та електрика під ключ',
    price: 25000,
    desc: 'Повне розведення труб, щиток, автомати та точки монтажу',
  },
  materials_delivery: {
    title: 'Закупівля та логістика матеріалів',
    price: 8000,
    desc: 'Організація оптових цін, розвантаження та підйом на поверх',
  },
};

export const formatUAH = (amount: number): string => {
  return `${amount.toLocaleString('uk-UA')} грн`;
};

export const calculateEstimate = (
  repairType: RepairType,
  propertyType: PropertyType,
  areaM2: number,
  addons: AddonKey[]
): CalculationBreakdown => {
  const baseRate = REPAIR_RATES[repairType]?.pricePerM2 || 2500;
  const multiplier = PROPERTY_MULTIPLIERS[propertyType]?.multiplier || 1.0;

  let addonsTotal = 0;
  addons.forEach((key) => {
    if (ADDONS_DATA[key]) {
      addonsTotal += ADDONS_DATA[key].price;
    }
  });

  const baseCost = Math.round(areaM2 * baseRate * multiplier);
  const totalAmount = baseCost + addonsTotal;

  return {
    baseRate,
    multiplier,
    baseCost,
    addonsTotal,
    totalAmount,
    totalFormatted: formatUAH(totalAmount),
  };
};
