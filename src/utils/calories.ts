// 运动卡路里计算工具
// 基于MET (代谢当量) 值估算

export interface CalorieCalculation {
  calories: number;
  formula: string;
  description: string;
}

// 各种运动的MET值
const MET_VALUES: Record<string, number> = {
  walking: 3.5,      // 快走
  jogging: 7.0,      // 慢跑
  cycling: 6.0,      // 骑行
  yoga: 3.0,         // 瑜伽
  strength: 5.0,     // 力量训练
  swimming: 8.0,     // 游泳
  other: 4.0,        // 其他运动
};

// 计算卡路里消耗
// 公式: 卡路里 = MET × 体重(kg) × 时间(小时)
export const calculateCalories = (
  exerciseType: string,
  durationMinutes: number,
  weightKg: number
): CalorieCalculation => {
  const met = MET_VALUES[exerciseType] || MET_VALUES.other;
  const durationHours = durationMinutes / 60;
  const calories = Math.round(met * weightKg * durationHours);

  return {
    calories,
    formula: `${met} MET × ${weightKg}kg × ${durationHours.toFixed(2)}h`,
    description: getExerciseDescription(exerciseType),
  };
};

// 获取运动类型的中文描述
const getExerciseDescription = (type: string): string => {
  const descriptions: Record<string, string> = {
    walking: '快走 - 低强度有氧运动',
    jogging: '慢跑 - 中高强度有氧运动',
    cycling: '骑行 - 低冲击有氧运动',
    yoga: '瑜伽 - 低强度柔韧运动',
    strength: '力量训练 - 增强肌肉力量',
    swimming: '游泳 - 全身有氧运动',
    other: '其他运动',
  };
  return descriptions[type] || descriptions.other;
};

// 获取所有运动类型及其MET值
export const getExerciseTypes = (): { type: string; label: string; met: number; icon: string }[] => [
  { type: 'walking', label: '快走', met: 3.5, icon: '🚶' },
  { type: 'jogging', label: '慢跑', met: 7.0, icon: '🏃' },
  { type: 'cycling', label: '骑行', met: 6.0, icon: '🚴' },
  { type: 'yoga', label: '瑜伽', met: 3.0, icon: '🧘' },
  { type: 'strength', label: '力量', met: 5.0, icon: '🏋️' },
  { type: 'swimming', label: '游泳', met: 8.0, icon: '🏊' },
];

// 估算每日建议卡路里消耗 (基于脂肪肝建议)
export const getRecommendedDailyCalories = (
  targetExerciseMinutes: number,
  weightKg: number
): number => {
  // 假设平均MET为5 (中等强度)
  const avgMET = 5;
  const durationHours = targetExerciseMinutes / 60;
  return Math.round(avgMET * weightKg * durationHours);
};
