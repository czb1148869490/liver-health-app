// 个性化运动处方计算工具

import type { Profile } from '../types/health';

export interface ExercisePrescription {
  level: 'beginner' | 'intermediate' | 'advanced';
  targetMinutes: number;
  weeklyTarget: number;
  recommendedExercises: ExerciseRecommendation[];
  warnings: string[];
  goals: string[];
}

export interface ExerciseRecommendation {
  type: string;
  name: string;
  duration: string;
  frequency: string;
  intensity: 'low' | 'moderate' | 'high';
  description: string;
  benefits: string[];
  icon: string;
}

// 计算BMI
export const calculateBMI = (heightCm: number, weightKg: number): number => {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

// 获取BMI分类
export const getBMICategory = (bmi: number): { category: string; color: string } => {
  if (bmi < 18.5) return { category: '偏瘦', color: '#ffcc00' };
  if (bmi < 24) return { category: '正常', color: '#34c759' };
  if (bmi < 28) return { category: '超重', color: '#ff9500' };
  return { category: '肥胖', color: '#ff3b30' };
};

// 生成个性化运动处方
export const generateExercisePrescription = (profile: Profile): ExercisePrescription => {
  const bmi = calculateBMI(profile.height, profile.currentWeight);

  // 根据BMI和脂肪肝程度确定运动级别
  let level: 'beginner' | 'intermediate' | 'advanced';
  let targetMinutes: number;
  let weeklyTarget: number;

  if (bmi >= 28 || profile.fattyLiverLevel === 'severe') {
    level = 'beginner';
    targetMinutes = 10;
    weeklyTarget = 100;
  } else if (bmi >= 24 || profile.fattyLiverLevel === 'moderate') {
    level = 'intermediate';
    targetMinutes = 20;
    weeklyTarget = 150;
  } else {
    level = 'advanced';
    targetMinutes = 30;
    weeklyTarget = 210;
  }

  // 如果用户已有更高的目标，保持用户的设置
  if (profile.targetExerciseMinutes > targetMinutes) {
    targetMinutes = profile.targetExerciseMinutes;
    weeklyTarget = targetMinutes * 7;
  }

  // 生成推荐运动列表
  const recommendedExercises = getRecommendedExercises(level, profile.fattyLiverLevel);

  // 生成警告信息
  const warnings = getWarnings(bmi, profile.fattyLiverLevel);

  // 生成目标
  const goals = getGoals(bmi, profile);

  return {
    level,
    targetMinutes,
    weeklyTarget,
    recommendedExercises,
    warnings,
    goals,
  };
};

// 获取推荐运动
const getRecommendedExercises = (
  level: 'beginner' | 'intermediate' | 'advanced',
  _fattyLiverLevel: string
): ExerciseRecommendation[] => {
  const allExercises: ExerciseRecommendation[] = [
    {
      type: 'walking',
      name: '快走',
      duration: level === 'beginner' ? '15-20分钟' : level === 'intermediate' ? '25-35分钟' : '30-45分钟',
      frequency: '每天或每周4-5次',
      intensity: 'moderate',
      description: '简单易行，适合所有人群',
      benefits: ['提高心肺功能', '促进脂肪燃烧', '改善胰岛素敏感性'],
      icon: '🚶',
    },
    {
      type: 'jogging',
      name: '慢跑',
      duration: level === 'beginner' ? '10-15分钟' : level === 'intermediate' ? '20-30分钟' : '25-40分钟',
      frequency: '每周3-4次',
      intensity: 'moderate',
      description: '中强度有氧，燃脂效果好',
      benefits: ['高效燃脂', '增强心肺', '释放压力'],
      icon: '🏃',
    },
    {
      type: 'cycling',
      name: '骑行',
      duration: level === 'beginner' ? '15-20分钟' : level === 'intermediate' ? '25-35分钟' : '30-45分钟',
      frequency: '每周3-4次',
      intensity: 'moderate',
      description: '低冲击运动，保护关节',
      benefits: ['锻炼下肢', '提高代谢', '关节友好'],
      icon: '🚴',
    },
    {
      type: 'yoga',
      name: '瑜伽',
      duration: '20-40分钟',
      frequency: '每周3-5次',
      intensity: 'low',
      description: '柔韧性和平衡训练',
      benefits: ['改善柔韧性', '减压放松', '调节呼吸'],
      icon: '🧘',
    },
    {
      type: 'swimming',
      name: '游泳',
      duration: level === 'beginner' ? '15-20分钟' : level === 'intermediate' ? '25-35分钟' : '30-45分钟',
      frequency: '每周2-3次',
      intensity: 'moderate',
      description: '全身运动，关节负担小',
      benefits: ['锻炼全身肌肉', '提高心肺', '关节保护'],
      icon: '🏊',
    },
    {
      type: 'strength',
      name: '力量训练',
      duration: '20-30分钟',
      frequency: '每周2-3次',
      intensity: level === 'beginner' ? 'low' : 'moderate',
      description: '增加肌肉量，提高基础代谢',
      benefits: ['增加肌肉', '提高代谢', '改善体型'],
      icon: '🏋️',
    },
  ];

  // 根据级别筛选和排序
  let filtered: ExerciseRecommendation[];
  if (level === 'beginner') {
    // 初学者优先推荐低强度运动
    filtered = allExercises.filter(e => e.intensity === 'low').concat(
      allExercises.filter(e => e.intensity === 'moderate' && e.type === 'walking')
    );
  } else if (level === 'intermediate') {
    filtered = allExercises.filter(e => e.type !== 'strength');
  } else {
    filtered = allExercises;
  }

  return filtered.slice(0, 4); // 返回前4个推荐
};

// 获取警告信息
const getWarnings = (bmi: number, fattyLiverLevel: string): string[] => {
  const warnings: string[] = [];

  if (bmi >= 30) {
    warnings.push('BMI较高，建议从低强度运动开始，注意保护关节');
  }

  if (fattyLiverLevel === 'severe') {
    warnings.push('重度脂肪肝建议在医生指导下运动');
  }

  warnings.push('运动前建议热身5-10分钟');
  warnings.push('如出现头晕、胸闷等不适请立即停止运动');

  return warnings;
};

// 获取目标
const getGoals = (bmi: number, profile: Profile): string[] => {
  const goals: string[] = [];

  // 减重目标
  const weightToLose = profile.currentWeight - profile.targetWeight;
  if (weightToLose > 0) {
    const weeksToGoal = Math.ceil(weightToLose / 0.5); // 每周减0.5kg
    goals.push(`目标：${weeksToGoal}周内达到目标体重`);
  }

  // 脂肪肝改善目标
  if (bmi >= 24) {
    goals.push('目标：BMI降至24以下，改善脂肪肝');
  }

  // 运动目标
  goals.push('目标：每周累计运动150分钟以上');

  return goals;
};

// 获取运动强度说明
export const getIntensityLabel = (intensity: 'low' | 'moderate' | 'high'): string => {
  const labels = {
    low: '低强度 - 可以正常说话，感觉轻松',
    moderate: '中等强度 - 可以说话但有些喘',
    high: '高强度 - 说话困难，需要用力呼吸',
  };
  return labels[intensity];
};
