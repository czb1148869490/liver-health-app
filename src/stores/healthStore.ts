import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { requestNotificationPermission, sendNotification, ReminderNotifications } from '../utils/notifications';
import type {
  Profile,
  DailyRecord,
  Reminder,
  Achievement,
  MedicalCheckup,
  ExerciseLog,
  WeightLog,
  MealLog,
  Milestone,
} from '../types/health';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getTodayDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const defaultAchievements: Achievement[] = [
  { id: 'first_checkin', title: '初次打卡', description: '完成第一次打卡', icon: '🌟', progress: 0, target: 1, points: 10 },
  { id: 'streak_7', title: '一周坚持', description: '连续7天打卡', icon: '🏃', progress: 0, target: 7, points: 50 },
  { id: 'streak_15', title: '半月坚持', description: '连续15天打卡', icon: '💪', progress: 0, target: 15, points: 100 },
  { id: 'streak_30', title: '满月挑战', description: '连续30天打卡', icon: '🏆', progress: 0, target: 30, points: 200 },
  { id: 'exercise_first', title: '运动达人', description: '完成第一次运动记录', icon: '🏋️', progress: 0, target: 1, points: 20 },
  { id: 'exercise_10', title: '运动累积', description: '累计运动10次', icon: '🎯', progress: 0, target: 10, points: 50 },
  { id: 'exercise_500', title: '运动达人', description: '累计运动500分钟', icon: '⭐', progress: 0, target: 500, points: 100 },
  { id: 'weight_loss_5', title: '减重5%', description: '减轻初始体重的5%', icon: '📉', progress: 0, target: 5, points: 100 },
  { id: 'weight_loss_10', title: '减重10%', description: '减轻初始体重的10%', icon: '🎉', progress: 0, target: 10, points: 200 },
  { id: 'healthy_eating', title: '健康饮食', description: '一天完成三餐打卡', icon: '🍽️', progress: 0, target: 1, points: 15 },
];

const createDefaultReminders = (): Reminder[] => [
  { id: 'default_morning_exercise', type: 'exercise', title: '晨间运动', description: '建议早晨进行适度的运动', time: '07:00', repeatPattern: 'daily', enabled: true },
  { id: 'default_liver_checkup', type: 'checkup', title: '肝功能检查', description: '建议每3个月进行一次肝功能检查', time: '09:00', repeatPattern: 'monthly', enabled: true, checkupType: 'liver_enzyme', intervalMonths: 3 },
];

type ThemeMode = 'light' | 'dark' | 'system';

interface HealthState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  completeOnboarding: () => void;

  todayRecord: DailyRecord | null;
  setTodayRecord: (record: DailyRecord) => void;
  updateTodayRecord: (updates: Partial<DailyRecord>) => void;

  records: Record<string, DailyRecord>;
  getRecordByDate: (date: string) => DailyRecord | undefined;
  saveRecord: (record: DailyRecord) => void;

  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;

  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;

  points: number;
  addPoints: (amount: number) => void;

  checkups: MedicalCheckup[];
  addCheckup: (checkup: Omit<MedicalCheckup, 'id'>) => void;

  exerciseLogs: ExerciseLog[];
  addExerciseLog: (log: Omit<ExerciseLog, 'id' | 'createdAt'>) => void;

  weightLogs: WeightLog[];
  addWeightLog: (log: Omit<WeightLog, 'id' | 'createdAt'>) => void;

  mealLogs: MealLog[];
  addMealLog: (log: Omit<MealLog, 'id'>) => void;

  currentStreak: number;
  longestStreak: number;
  calculateStreak: () => void;

  milestones: Milestone[];
  updateMilestones: () => void;

  getTodayProgress: () => { exercise: number; meals: number; total: number; percentage: number };
  getWeeklyExercise: () => number;
  checkAndUpdateAchievements: () => void;

  // 通知相关
  notificationPermission: boolean;
  lastNotificationDate: string;
  sentRemindersToday: string[];
  requestNotification: () => Promise<void>;
  checkReminders: () => void;
  notifyAchievement: (title: string, points: number) => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        // 应用主题到document
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // system
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },

      profile: null,
      todayRecord: null,
      records: {},
      reminders: createDefaultReminders(),
      achievements: defaultAchievements,
      points: 0,
      checkups: [],
      exerciseLogs: [],
      weightLogs: [],
      mealLogs: [],
      currentStreak: 0,
      longestStreak: 0,
      milestones: [],
      notificationPermission: false,
      lastNotificationDate: '',
      sentRemindersToday: [],

      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) => set((state) => ({ profile: state.profile ? { ...state.profile, ...updates } : null })),
      completeOnboarding: () => set((state) => ({ profile: state.profile ? { ...state.profile, onboardingCompleted: true } : null })),

      setTodayRecord: (record) => set({ todayRecord: record }),
      initTodayRecord: () => set((state) => {
        const today = getTodayDate();
        // 如果 todayRecord 不是今天的，则从 records 中查找今天的记录，或创建新的
        if (state.todayRecord?.date !== today) {
          const todayRecord = state.records[today];
          return { todayRecord: todayRecord || { id: generateId(), date: today, exerciseCompleted: false, exerciseDuration: 0, breakfastCompleted: false, lunchCompleted: false, dinnerCompleted: false, mood: 3, notes: '' } };
        }
        return {};
      }),
      updateTodayRecord: (updates) => set((state) => ({
        todayRecord: state.todayRecord ? { ...state.todayRecord, ...updates } : { id: generateId(), date: getTodayDate(), exerciseCompleted: false, exerciseDuration: 0, breakfastCompleted: false, lunchCompleted: false, dinnerCompleted: false, mood: 3, ...updates }
      })),

      getRecordByDate: (date) => get().records[date],
      saveRecord: (record) => set((state) => ({ records: { ...state.records, [record.date]: record }, todayRecord: record.date === getTodayDate() ? record : state.todayRecord })),

      addReminder: (reminder) => set((state) => ({ reminders: [...state.reminders, { ...reminder, id: generateId() }] })),
      updateReminder: (id, updates) => set((state) => ({ reminders: state.reminders.map((r) => r.id === id ? { ...r, ...updates } : r) })),
      deleteReminder: (id) => set((state) => ({ reminders: state.reminders.filter((r) => r.id !== id) })),
      toggleReminder: (id) => set((state) => ({ reminders: state.reminders.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r) })),

      unlockAchievement: (id) => set((state) => ({
        achievements: state.achievements.map((a) => a.id === id && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a),
        points: state.points + (state.achievements.find((a) => a.id === id)?.points || 0)
      })),
      updateAchievementProgress: (id, progress) => set((state) => ({ achievements: state.achievements.map((a) => a.id === id ? { ...a, progress } : a) })),

      addPoints: (amount) => set((state) => ({ points: state.points + amount })),

      addCheckup: (checkup) => set((state) => ({ checkups: [...state.checkups, { ...checkup, id: generateId() }] })),

      addExerciseLog: (log) => set((state) => ({ exerciseLogs: [...state.exerciseLogs, { ...log, id: generateId(), createdAt: Date.now() }] })),

      addWeightLog: (log) => set((state) => ({ weightLogs: [...state.weightLogs, { ...log, id: generateId(), createdAt: Date.now() }] })),

      addMealLog: (log) => set((state) => ({ mealLogs: [...state.mealLogs, { ...log, id: generateId() }] })),

      calculateStreak: () => {
        const { records } = get();
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          const record = records[dateStr];
          if (record && (record.exerciseCompleted || record.breakfastCompleted || record.lunchCompleted || record.dinnerCompleted)) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }
        set((state) => ({ currentStreak: streak, longestStreak: Math.max(state.longestStreak, streak) }));
      },

      updateMilestones: () => {
        const { profile, currentStreak, exerciseLogs } = get();
        if (!profile) return;
        const totalExerciseMinutes = exerciseLogs.reduce((sum, log) => sum + log.duration, 0);
        const weightLossPercent = profile.initialWeight > 0 ? ((profile.initialWeight - profile.currentWeight) / profile.initialWeight) * 100 : 0;
        const milestones: Milestone[] = [
          { id: 'streak_7', type: 'streak_7', title: '一周坚持', description: '连续7天打卡', target: 7, current: currentStreak, completed: currentStreak >= 7 },
          { id: 'streak_15', type: 'streak_15', title: '半月坚持', description: '连续15天打卡', target: 15, current: currentStreak, completed: currentStreak >= 15 },
          { id: 'streak_30', type: 'streak_30', title: '满月挑战', description: '连续30天打卡', target: 30, current: currentStreak, completed: currentStreak >= 30 },
          { id: 'weight_5', type: 'weight_5', title: '减重5%', description: '减轻初始体重的5%', target: 5, current: weightLossPercent, completed: weightLossPercent >= 5 },
          { id: 'weight_10', type: 'weight_10', title: '减重10%', description: '减轻初始体重的10%', target: 10, current: weightLossPercent, completed: weightLossPercent >= 10 },
          { id: 'exercise_total', type: 'exercise_total', title: '运动累积', description: '累计运动500分钟', target: 500, current: totalExerciseMinutes, completed: totalExerciseMinutes >= 500 },
        ];
        set({ milestones });
      },

      getTodayProgress: () => {
        const { todayRecord, profile } = get();
        if (!profile) return { exercise: 0, meals: 0, total: 0, percentage: 0 };
        // 运动完成得1分，三餐各得1分，总共4分
        let exerciseScore = 0;
        if (todayRecord?.exerciseCompleted && todayRecord.exerciseDuration >= profile.targetExerciseMinutes) {
          exerciseScore = 1;
        }
        let mealsScore = 0;
        if (todayRecord?.breakfastCompleted) mealsScore++;
        if (todayRecord?.lunchCompleted) mealsScore++;
        if (todayRecord?.dinnerCompleted) mealsScore++;
        const total = exerciseScore + mealsScore;
        const percentage = Math.round((total / 4) * 100);
        return { exercise: exerciseScore, meals: mealsScore, total, percentage };
      },

      getWeeklyExercise: () => {
        const { exerciseLogs } = get();
        const today = new Date();
        const dates: string[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          dates.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
        }
        return exerciseLogs.filter((log) => dates.includes(log.date)).reduce((sum, log) => sum + log.duration, 0);
      },

      checkAndUpdateAchievements: () => {
        const state = get();
        const { achievements, currentStreak, exerciseLogs, profile, todayRecord } = state;
        if (todayRecord && !achievements.find((a) => a.id === 'first_checkin')?.unlockedAt) get().unlockAchievement('first_checkin');
        if (currentStreak >= 7) { const ach = achievements.find((a) => a.id === 'streak_7'); if (ach && !ach.unlockedAt) get().unlockAchievement('streak_7'); }
        if (currentStreak >= 15) { const ach = achievements.find((a) => a.id === 'streak_15'); if (ach && !ach.unlockedAt) get().unlockAchievement('streak_15'); }
        if (currentStreak >= 30) { const ach = achievements.find((a) => a.id === 'streak_30'); if (ach && !ach.unlockedAt) get().unlockAchievement('streak_30'); }
        if (exerciseLogs.length > 0) { const ach = achievements.find((a) => a.id === 'exercise_first'); if (ach && !ach.unlockedAt) get().unlockAchievement('exercise_first'); }
        const exerciseCount = exerciseLogs.length;
        if (exerciseCount >= 10) { const ach = achievements.find((a) => a.id === 'exercise_10'); if (ach && !ach.unlockedAt) get().unlockAchievement('exercise_10'); }
        const totalExercise = exerciseLogs.reduce((sum, log) => sum + log.duration, 0);
        get().updateAchievementProgress('exercise_500', totalExercise);
        if (totalExercise >= 500) { const ach = achievements.find((a) => a.id === 'exercise_500'); if (ach && !ach.unlockedAt) get().unlockAchievement('exercise_500'); }
        if (profile) {
          const weightLoss = ((profile.initialWeight - profile.currentWeight) / profile.initialWeight) * 100;
          get().updateAchievementProgress('weight_loss_5', weightLoss);
          if (weightLoss >= 5) { const ach = achievements.find((a) => a.id === 'weight_loss_5'); if (ach && !ach.unlockedAt) get().unlockAchievement('weight_loss_5'); }
          get().updateAchievementProgress('weight_loss_10', weightLoss);
          if (weightLoss >= 10) { const ach = achievements.find((a) => a.id === 'weight_loss_10'); if (ach && !ach.unlockedAt) get().unlockAchievement('weight_loss_10'); }
        }
        if (todayRecord?.breakfastCompleted && todayRecord?.lunchCompleted && todayRecord?.dinnerCompleted) {
          const ach = achievements.find((a) => a.id === 'healthy_eating');
          if (ach && !ach.unlockedAt) get().unlockAchievement('healthy_eating');
        }
      },

      requestNotification: async () => {
        const permission = await requestNotificationPermission();
        set({ notificationPermission: permission.status === 'granted' });
      },

      checkReminders: () => {
        const { reminders, todayRecord, profile, lastNotificationDate, sentRemindersToday } = get();
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const currentMinute = now.getHours() * 60 + now.getMinutes();

        // 如果日期变化了，重置已发送的提醒列表
        let sentReminders = lastNotificationDate === today ? [...sentRemindersToday] : [];
        if (lastNotificationDate !== today) {
          set({ lastNotificationDate: today, sentRemindersToday: [] });
        }

        reminders.forEach((reminder) => {
          if (!reminder.enabled) return;
          if (reminder.time !== currentTime) return;
          // 检查这个提醒今天是否已经发送过
          if (sentReminders.includes(reminder.id)) return;

          switch (reminder.type) {
            case 'exercise':
              if (profile) {
                ReminderNotifications.exercise(profile.targetExerciseMinutes);
              }
              break;
            case 'checkup':
              ReminderNotifications.checkup(reminder.title);
              break;
            default:
              sendNotification(reminder.title, { body: reminder.description });
          }

          // 标记该提醒已发送
          sentReminders.push(reminder.id);
        });

        // 更新已发送的提醒列表
        if (sentReminders.length > 0) {
          set({ sentRemindersToday: sentReminders });
        }

        // 检查是否需要提醒用餐 (只在每小时的0-4分钟内检查)
        if (currentMinute < 5) {
          const hour = now.getHours();
          if (hour === 7 && !todayRecord?.breakfastCompleted && !sentReminders.includes('meal_breakfast')) {
            ReminderNotifications.breakfast();
            sentReminders.push('meal_breakfast');
          } else if (hour === 12 && !todayRecord?.lunchCompleted && !sentReminders.includes('meal_lunch')) {
            ReminderNotifications.lunch();
            sentReminders.push('meal_lunch');
          } else if (hour === 18 && !todayRecord?.dinnerCompleted && !sentReminders.includes('meal_dinner')) {
            ReminderNotifications.dinner();
            sentReminders.push('meal_dinner');
          }

          // 更新已发送的提醒列表
          if (sentReminders.length > 0) {
            set({ sentRemindersToday: sentReminders });
          }
        }
      },

      notifyAchievement: (title: string, points: number) => {
        if (get().notificationPermission) {
          ReminderNotifications.achievement(title, points);
        }
      },
    }),
    { name: 'health-storage' }
  )
);
