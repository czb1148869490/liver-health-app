// 每日健康小贴士数据

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  category: 'diet' | 'exercise' | 'lifestyle' | '检查';
  icon: string;
}

export const dailyTips: DailyTip[] = [
  // 饮食相关
  {
    id: 'tip-breakfast',
    title: '早餐很重要',
    content: '不吃早餐会导致午餐和晚餐暴饮暴食，反而更容易堆积脂肪。建议每天7-9点之间吃早餐，选择全谷物+蛋白质+水果的组合。',
    category: 'diet',
    icon: '🍳',
  },
  {
    id: 'tip-olive-oil',
    title: '选择健康油脂',
    content: '烹饪用油建议选择特级初榨橄榄油，富含单不饱和脂肪酸，对心血管和肝脏都有保护作用。',
    category: 'diet',
    icon: '🫒',
  },
  {
    id: 'tip-water',
    title: '多喝水',
    content: '每天喝足够的水有助于代谢。建议每天饮用1500-2000ml水，可以帮助肝脏更有效地排毒。',
    category: 'diet',
    icon: '💧',
  },
  {
    id: 'tip-fruit',
    title: '水果要适量',
    content: '水果虽好，但含糖量不低。建议每天水果摄入量控制在200-350克，优先选择低糖水果如苹果、梨、柚子。',
    category: 'diet',
    icon: '🍎',
  },
  {
    id: 'tip-sleep',
    title: '晚餐时间',
    content: '晚餐尽量在睡前3小时吃完，给身体足够时间消化。晚间代谢减慢，过晚进食容易导致脂肪堆积。',
    category: 'diet',
    icon: '🌙',
  },
  {
    id: 'tip-fiber',
    title: '多吃膳食纤维',
    content: '膳食纤维能增加饱腹感，减少热量摄入，还能改善肠道菌群。建议每天摄入25-35克膳食纤维。',
    category: 'diet',
    icon: '🥬',
  },
  // 运动相关
  {
    id: 'tip-walk',
    title: '饭后百步走',
    content: '饭后散步20-30分钟可以帮助降低血糖和血脂，减少脂肪在肝脏的堆积。记得等饭后30分钟再开始。',
    category: 'exercise',
    icon: '🚶',
  },
  {
    id: 'tip-morning',
    title: '晨练好处多',
    content: '早晨运动可以提高一天的新陈代谢，但要注意热身。空腹运动需谨慎，容易导致血糖过低。',
    category: 'exercise',
    icon: '🌅',
  },
  {
    id: 'tip-stretch',
    title: '运动后拉伸',
    content: '运动后一定要做拉伸，可以减少肌肉酸痛，增加柔韧性，还能帮助身体恢复。每次拉伸10-15分钟。',
    category: 'exercise',
    icon: '🧘',
  },
  {
    id: 'tip-daily-steps',
    title: '日行万步',
    content: '对于久坐人群，建议每天走10000步。可以利用碎片时间：上班路上、午休时、晚饭后分段完成。',
    category: 'exercise',
    icon: '👟',
  },
  {
    id: 'tip-strength',
    title: '加入力量训练',
    content: '除了有氧运动，建议每周加入2-3次力量训练。肌肉量增加可以提高基础代谢率，帮助持续燃脂。',
    category: 'exercise',
    icon: '💪',
  },
  // 生活习惯
  {
    id: 'tip-sleep-7',
    title: '保证睡眠',
    content: '每天保证7-8小时高质量睡眠。睡眠不足会影响代谢激素，增加食欲，还会让身体更倾向于储存脂肪。',
    category: 'lifestyle',
    icon: '😴',
  },
  {
    id: 'tip-stress',
    title: '管理压力',
    content: '长期压力会导致皮质醇升高，促进脂肪在腹部堆积。尝试冥想、深呼吸、瑜伽等方式缓解压力。',
    category: 'lifestyle',
    icon: '🧘',
  },
  {
    id: 'tip-alcohol',
    title: '关于饮酒',
    content: '酒精是肝脏的天敌，即使有脂肪肝也要尽量避免饮酒。如必须饮酒，建议男性每天不超过25g纯酒精（约啤酒300ml）。',
    category: 'lifestyle',
    icon: '🍺',
  },
  {
    id: 'tip-weight-loss',
    title: '减重速度',
    content: '减重要循序渐进，每周减重0.5-1kg最为理想。减重过快可能导致营养不良，还容易反弹。',
    category: 'lifestyle',
    icon: '⚖️',
  },
  {
    id: 'tip-consistency',
    title: '坚持最重要',
    content: '不要追求完美，80%的坚持比100%但无法持续更好。每天进步一点点，长期坚持就是胜利！',
    category: 'lifestyle',
    icon: '🎯',
  },
  // 检查相关
  {
    id: 'tip-bmi',
    title: '关注BMI',
    content: 'BMI = 体重(kg) / 身高²(m)。BMI超过25就属于超重，超过28可能需要更积极的干预。',
    category: '检查',
    icon: '📊',
  },
  {
    id: 'tip-waist',
    title: '腰围很重要',
    content: '腰围反映内脏脂肪堆积。男性腰围>90cm，女性>80cm，脂肪肝风险显著增加。建议每周测量一次。',
    category: '检查',
    icon: '📏',
  },
  {
    id: 'tip-regular-checkup',
    title: '定期复查',
    content: '即使没有症状，脂肪肝患者也要每3-6个月复查一次。肝功能和超声是基本的复查项目。',
    category: '检查',
    icon: '🩺',
  },
  {
    id: 'tip-compare',
    title: '记录变化',
    content: '建议每月记录一次体重、腰围和体能变化。数据对比能帮助你看到进步，保持动力。',
    category: '检查',
    icon: '📈',
  },
];

// 根据日期获取今日tip
export const getTodayTip = (): DailyTip => {
  // 使用日期作为种子，确保每天的tip是固定的
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  // 轮换展示不同的tip
  const index = dayOfYear % dailyTips.length;
  return dailyTips[index];
};

// 获取分类名称
export const getCategoryName = (category: DailyTip['category']): string => {
  const names = {
    diet: '饮食',
    exercise: '运动',
    lifestyle: '生活',
    检查: '检查',
  };
  return names[category];
};
