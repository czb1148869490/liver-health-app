// 脂肪肝健康管理应用类型定义

export interface Profile {
  id: string;
  name: string;
  height: number;
  initialWeight: number;
  currentWeight: number;
  targetWeight: number;
  fattyLiverLevel: 'mild' | 'moderate' | 'severe';
  targetExerciseMinutes: number;
  createdAt: number;
  onboardingCompleted: boolean;
}

export interface DailyRecord {
  id: string;
  date: string;
  exerciseCompleted: boolean;
  exerciseDuration: number;
  exerciseType?: ExerciseType;
  breakfastCompleted: boolean;
  lunchCompleted: boolean;
  dinnerCompleted: boolean;
  weight?: number;
  mood: Mood;
  notes?: string;
}

export type ExerciseType = 'walking' | 'jogging' | 'cycling' | 'yoga' | 'strength' | 'swimming' | 'other';
export type Mood = 1 | 2 | 3 | 4 | 5;

export interface Reminder {
  id: string;
  type: 'exercise' | 'checkup' | 'custom';
  title: string;
  description?: string;
  time: string;
  repeatPattern: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
  nextTriggerAt?: number;
  checkupType?: 'liver_enzyme' | 'ultrasound' | 'blood_lipid' | 'custom';
  intervalMonths?: number;
  lastCompletedAt?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress: number;
  target: number;
  points: number;
}

export interface MedicalCheckup {
  id: string;
  date: string;
  type: 'liver_enzyme' | 'ultrasound' | 'blood_lipid' | 'custom';
  title: string;
  results?: {
    alt?: number;
    ast?: number;
    ggt?: number;
    ultrasoundResult?: string;
    totalCholesterol?: number;
    triglycerides?: number;
    hdl?: number;
    ldl?: number;
  };
  notes?: string;
}

export interface ExerciseLog {
  id: string;
  date: string;
  type: ExerciseType;
  duration: number;
  calories?: number;
  createdAt: number;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
  createdAt: number;
}

export interface MealLog {
  id: string;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  completed: boolean;
  notes?: string;
}

export interface Milestone {
  id: string;
  type: 'streak_7' | 'streak_15' | 'streak_30' | 'weight_5' | 'weight_10' | 'exercise_total';
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  completedAt?: number;
}
