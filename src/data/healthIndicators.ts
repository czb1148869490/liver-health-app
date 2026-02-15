// 健康指标解读数据

export interface Indicator {
  id: string;
  name: string;
  nameEn: string;
  category: 'liver' | 'metabolic' | 'body';
  unit: string;
  normal: string;
  warning: string;
  danger: string;
  description: string;
  howToImprove: string;
  icon: string;
}

export const healthIndicators: Indicator[] = [
  // 肝功能指标
  {
    id: 'alt',
    name: '谷丙转氨酶',
    nameEn: 'ALT',
    category: 'liver',
    unit: 'U/L',
    normal: '< 40',
    warning: '40-80',
    danger: '> 80',
    description: 'ALT是最常用的肝功能指标，主要存在于肝细胞中。当肝细胞受损时，ALT会释放到血液中，导致数值升高。',
    howToImprove: '1. 戒酒 2. 控制饮食 3. 适度运动 4. 控制体重 5. 避免肝毒性药物',
    icon: '🫁',
  },
  {
    id: 'ast',
    name: '谷草转氨酶',
    nameEn: 'AST',
    category: 'liver',
    unit: 'U/L',
    normal: '< 40',
    warning: '40-80',
    danger: '> 80',
    description: 'AST存在于多种组织中（肝、心、肌等），升高可能提示肝细胞损伤或心脏问题。需要结合其他指标综合判断。',
    howToImprove: '1. 戒酒 2. 控制饮食 3. 适度运动 4. 避免剧烈运动 5. 定期复查',
    icon: '❤️',
  },
  {
    id: 'ggt',
    name: '谷氨酰转肽酶',
    nameEn: 'GGT',
    category: 'liver',
    unit: 'U/L',
    normal: '< 50',
    warning: '50-100',
    danger: '> 100',
    description: 'GGT是胆管酶，升高通常提示胆汁淤积或酒精性肝损伤。对脂肪肝的诊断有重要参考价值。',
    howToImprove: '1. 严格戒酒 2. 控制高脂肪饮食 3. 减轻体重 4. 增加运动',
    icon: '💚',
  },
  // 代谢指标
  {
    id: 'tg',
    name: '甘油三酯',
    nameEn: 'TG',
    category: 'metabolic',
    unit: 'mmol/L',
    normal: '< 1.7',
    warning: '1.7-2.3',
    danger: '> 2.3',
    description: '甘油三酯是血液中最主要的脂肪类型，升高与心血管疾病和脂肪肝密切相关。是代谢综合征的重要指标。',
    howToImprove: '1. 控制碳水摄入 2. 增加膳食纤维 3. 适度运动 4. 减肥 5. 限制酒精',
    icon: '🧈',
  },
  {
    id: 'tc',
    name: '总胆固醇',
    nameEn: 'TC',
    category: 'metabolic',
    unit: 'mmol/L',
    normal: '< 5.2',
    warning: '5.2-6.2',
    danger: '> 6.2',
    description: '总胆固醇包括好胆固醇和坏胆固醇。需要结合HDL和LDL综合评估心血管风险。',
    howToImprove: '1. 减少饱和脂肪摄入 2. 增加膳食纤维 3. 适度运动 4. 保持健康体重',
    icon: '🫀',
  },
  {
    id: 'hdl',
    name: '高密度脂蛋白',
    nameEn: 'HDL',
    category: 'metabolic',
    unit: 'mmol/L',
    normal: '> 1.0',
    warning: '0.9-1.0',
    danger: '< 0.9',
    description: 'HDL是好胆固醇，能够清除血管中的胆固醇，具有保护心血管的作用。数值越高越好。',
    howToImprove: '1. 适度运动 2. 摄入健康脂肪（如橄榄油、坚果） 3. 戒烟 4. 保持健康体重',
    icon: '✨',
  },
  {
    id: 'ldl',
    name: '低密度脂蛋白',
    nameEn: 'LDL',
    category: 'metabolic',
    unit: 'mmol/L',
    normal: '< 3.4',
    warning: '3.4-4.1',
    danger: '> 4.1',
    description: 'LDL是坏胆固醇，容易沉积在血管壁上形成斑块，增加心血管疾病风险。',
    howToImprove: '1. 减少饱和脂肪摄入 2. 增加膳食纤维 3. 适度运动 4. 减肥',
    icon: '⚠️',
  },
  {
    id: 'fbg',
    name: '空腹血糖',
    nameEn: 'FBG',
    category: 'metabolic',
    unit: 'mmol/L',
    normal: '3.9-6.1',
    warning: '6.1-7.0',
    danger: '> 7.0',
    description: '空腹血糖反映身体对血糖的调节能力。持续升高可能提示糖尿病或糖尿病前期。',
    howToImprove: '1. 控制碳水摄入 2. 增加运动 3. 减重 4. 保证睡眠 5. 减少压力',
    icon: '🍬',
  },
  // 体型指标
  {
    id: 'bmi',
    name: '体质指数',
    nameEn: 'BMI',
    category: 'body',
    unit: 'kg/m²',
    normal: '18.5-24',
    warning: '24-28',
    danger: '> 28',
    description: 'BMI是评估体重是否健康的常用指标。计算公式：体重(kg)÷身高(m)²。',
    howToImprove: '1. 控制饮食 2. 增加运动 3. 保持健康生活习惯',
    icon: '⚖️',
  },
  {
    id: 'waist',
    name: '腰围',
    nameEn: 'Waist',
    category: 'body',
    unit: 'cm',
    normal: '< 90(男)/< 80(女)',
    warning: '90-100(男)/80-90(女)',
    danger: '> 100(男)/> 90(女)',
    description: '腰围反映腹部脂肪堆积程度，是评估内脏脂肪的重要指标。中心性肥胖与脂肪肝密切相关。',
    howToImprove: '1. 有氧运动 2. 控制饮食 3. 减少久坐 4. 保证睡眠',
    icon: '📏',
  },
];

// 获取指标分类
export const getCategoryName = (category: Indicator['category']): string => {
  const names = {
    liver: '肝功能指标',
    metabolic: '代谢指标',
    body: '体型指标',
  };
  return names[category];
};

// 获取分类图标
export const getCategoryIcon = (category: Indicator['category']): string => {
  const icons = {
    liver: '🫁',
    metabolic: '⚗️',
    body: '📊',
  };
  return icons[category];
};

// 获取指标状态
export const getIndicatorStatus = (
  value: number,
  normal: string,
  warning: string,
  danger: string
): 'normal' | 'warning' | 'danger' => {
  const normalMax = parseFloat(normal.replace('<', ''));
  const dangerMin = parseFloat(danger.replace('>', ''));

  if (value < normalMax) return 'normal';
  if (value > dangerMin) return 'danger';
  return 'warning';
};
