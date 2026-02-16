import { useState, useEffect } from 'react';
import { useHealthStore } from '../stores/healthStore';
import type { Reminder } from '../types/health';
import { User, Target, Download, Trash2, Heart, Info, Moon, Sun, Monitor, FileText, Trophy, Bell, Activity, ChevronRight, Plus } from 'lucide-react';
import { generateMedicalReport } from '../utils/pdfExport';
import { useResponsive, useThemeColors } from '../hooks/useResponsive';
import { IosCard, IosListItem, IosProgress, IosConfirm, IosToast } from '../components/ios/IosComponents';
import { impactLight, success } from '../utils/haptics';
import * as Switch from '@radix-ui/react-switch';
import * as Progress from '@radix-ui/react-progress';

type TabType = 'profile' | 'achievements' | 'reminders';

export function Profile() {
  const store = useHealthStore();
  const { profile, points, currentStreak } = store;
  const { isMobile } = useResponsive();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    store.calculateStreak();
    store.updateMilestones();
    store.checkAndUpdateAchievements();
  }, []);

  if (!profile) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: colors.textSecondary }}>
        请先在首页完成个人资料设置
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: '设置', icon: User },
    { id: 'achievements' as const, label: '成就', icon: Trophy },
    { id: 'reminders' as const, label: '提醒', icon: Bell },
  ];

  return (
    <div style={{ maxWidth: isMobile ? '100%' : 500, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: colors.text, margin: 0 }}>
          我的
        </h1>
        <p style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
          管理个人信息和设置
        </p>
      </div>

      {/* Profile Summary */}
      <IosCard style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: 'linear-gradient(135deg, #007aff, #5856d6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}>
              <User size={28} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: colors.textSecondary }}>
                当前体重 {profile.currentWeight?.toFixed(1)} kg · 目标 {profile.targetWeight} kg
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.warning }}>{currentStreak}</div>
              <div style={{ fontSize: 11, color: colors.textSecondary }}>连续天</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>{points}</div>
              <div style={{ fontSize: 11, color: colors.textSecondary }}>积分</div>
            </div>
          </div>
        </div>
      </IosCard>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: 12,
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === tab.id ? colors.primary : colors.bgTertiary,
                color: activeTab === tab.id ? 'white' : colors.textSecondary,
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && <ProfileSettings profile={profile} colors={colors} />}
      {activeTab === 'achievements' && <AchievementsSection colors={colors} />}
      {activeTab === 'reminders' && <RemindersSection colors={colors} />}
    </div>
  );
}

function ProfileSettings({ profile, colors }: {
  profile: NonNullable<ReturnType<typeof useHealthStore.getState>['profile']>;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const { updateProfile, setTheme, theme, records, checkups, exerciseLogs, weightLogs, currentStreak } = useHealthStore();
  const [name, setName] = useState(profile.name);
  const [targetWeight, setTargetWeight] = useState(profile.targetWeight.toString());
  const [targetExercise, setTargetExercise] = useState(profile.targetExerciseMinutes);
  const [confirmState, setConfirmState] = useState<{ open: boolean; type: 'import' | 'clear' | null }>({ open: false, type: null });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setName(profile.name);
    setTargetWeight(profile.targetWeight.toString());
    setTargetExercise(profile.targetExerciseMinutes);
  }, [profile]);

  const handleSave = (field: string, value: string | number) => {
    if (field === 'name') {
      updateProfile({ name: value as string });
    } else if (field === 'targetWeight') {
      updateProfile({ targetWeight: parseFloat(value as string) || profile.targetWeight });
    } else if (field === 'targetExercise') {
      updateProfile({ targetExerciseMinutes: value as number });
    }
    setToast({ message: '已保存', type: 'success' });
    setTimeout(() => setToast(null), 2000);
  };

  const handleExport = () => {
    const data = localStorage.getItem('health-storage');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      success();
      setToast({ message: '数据导出成功', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleExportPDF = () => {
    generateMedicalReport({ profile, records, checkups, exerciseLogs, weightLogs, currentStreak });
    success();
    setToast({ message: 'PDF导出成功', type: 'success' });
    setTimeout(() => setToast(null), 2000);
  };

  const handleClear = () => {
    setConfirmState({ open: true, type: 'clear' });
  };

  const executeClear = () => {
    localStorage.removeItem('health-storage');
    setConfirmState({ open: false, type: null });
    setToast({ message: '数据已清除', type: 'success' });
    setTimeout(() => window.location.reload(), 1500);
  };

  const themeOptions = [
    { value: 'light', label: '浅色', icon: <Sun size={18} /> },
    { value: 'dark', label: '深色', icon: <Moon size={18} /> },
    { value: 'system', label: '系统', icon: <Monitor size={18} /> },
  ] as const;

  return (
    <div>
      {/* Name & Target */}
      <IosCard>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: colors.textSecondary, marginBottom: 12 }}>个人信息</h3>
        <IosListItem>
          <User size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleSave('name', name)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: 15,
              color: colors.text,
              outline: 'none',
            }}
          />
        </IosListItem>
        <IosListItem>
          <Target size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
          <span style={{ fontSize: 14, color: colors.textSecondary }}>目标体重</span>
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            onBlur={() => handleSave('targetWeight', targetWeight)}
            step="0.1"
            style={{
              width: 60,
              border: 'none',
              background: 'transparent',
              fontSize: 15,
              fontWeight: 500,
              color: colors.text,
              textAlign: 'right',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: 13, color: colors.textSecondary, marginLeft: 4 }}>kg</span>
        </IosListItem>
        <IosListItem>
          <Activity size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
          <span style={{ fontSize: 14, color: colors.textSecondary }}>每日运动</span>
          <select
            value={targetExercise}
            onChange={(e) => { setTargetExercise(parseInt(e.target.value)); handleSave('targetExercise', parseInt(e.target.value)); }}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 15,
              fontWeight: 500,
              color: colors.text,
              textAlign: 'right',
              outline: 'none',
              direction: 'rtl',
            }}
          >
            <option value="10">10分钟</option>
            <option value="20">20分钟</option>
            <option value="30">30分钟</option>
            <option value="45">45分钟</option>
            <option value="60">60分钟</option>
          </select>
        </IosListItem>
      </IosCard>

      {/* Theme */}
      <IosCard>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: colors.textSecondary, marginBottom: 12 }}>外观</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => { impactLight(); setTheme(option.value); }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: 12,
                borderRadius: 12,
                border: theme === option.value ? `2px solid ${colors.primary}` : `2px solid ${colors.border}`,
                background: theme === option.value ? 'rgba(0,122,255,0.08)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: theme === option.value ? colors.primary : colors.bgTertiary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme === option.value ? 'white' : colors.textSecondary,
              }}>
                {option.icon}
              </div>
              <span style={{ fontSize: 12, color: theme === option.value ? colors.primary : colors.textSecondary }}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </IosCard>

      {/* Data */}
      <IosCard>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: colors.textSecondary, marginBottom: 12 }}>数据</h3>
        <IosListItem onClick={handleExport}>
          <Download size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <span style={{ flex: 1, fontSize: 15, color: colors.text }}>导出数据</span>
          <ChevronRight size={18} color={colors.textTertiary} />
        </IosListItem>
        <IosListItem onClick={handleExportPDF}>
          <FileText size={20} color={colors.success} style={{ marginRight: 12 }} />
          <span style={{ flex: 1, fontSize: 15, color: colors.text }}>导出PDF报告</span>
          <ChevronRight size={18} color={colors.textTertiary} />
        </IosListItem>
        <IosListItem onClick={handleClear}>
          <Trash2 size={20} color={colors.danger} style={{ marginRight: 12 }} />
          <span style={{ flex: 1, fontSize: 15, color: colors.danger }}>清除所有数据</span>
          <ChevronRight size={18} color={colors.textTertiary} />
        </IosListItem>
      </IosCard>

      {/* Health Info */}
      <IosCard>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Info size={18} color={colors.primary} style={{ marginRight: 10, marginTop: 2 }} />
          <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
            <div>初始: {profile.initialWeight} kg</div>
            <div>当前: {profile.currentWeight?.toFixed(1)} kg</div>
            <div>目标: {profile.targetWeight} kg</div>
            {profile.currentWeight && profile.initialWeight && (
              <div style={{ color: colors.success, marginTop: 4 }}>
                已减 {(((profile.initialWeight - profile.currentWeight) / profile.initialWeight) * 100).toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      </IosCard>

      {/* Dialogs & Toasts */}
      {confirmState.open && confirmState.type === 'clear' && (
        <IosConfirm
          title="清除数据"
          message="确定要清除所有数据吗？此操作不可恢复。"
          confirmText="确定清除"
          cancelText="取消"
          onConfirm={executeClear}
          onCancel={() => setConfirmState({ open: false, type: null })}
          danger
        />
      )}
      {toast && <IosToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function AchievementsSection({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const { achievements, points, milestones } = useHealthStore();

  const totalPoints = achievements.filter((a) => a.unlockedAt).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  // 只显示正在进行中和已解锁的成就
  const activeAchievements = achievements.filter((a) => !a.unlockedAt && a.progress > 0);
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <IosCard style={{ textAlign: 'center', padding: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.warning }}>{points}</div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>当前积分</div>
        </IosCard>
        <IosCard style={{ textAlign: 'center', padding: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.success }}>{totalPoints}</div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>累计获得</div>
        </IosCard>
        <IosCard style={{ textAlign: 'center', padding: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.primary }}>{unlockedCount}</div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>解锁成就</div>
        </IosCard>
      </div>

      {/* Milestones */}
      <IosCard>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: colors.textSecondary, marginBottom: 12 }}>里程碑进度</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {milestones.slice(0, 3).map((milestone) => {
            const progress = milestone.target > 0 ? Math.min((milestone.current / milestone.target) * 100, 100) : 0;
            return (
              <div key={milestone.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: colors.text }}>{milestone.title}</span>
                  <span style={{ fontSize: 12, color: milestone.completed ? colors.success : colors.textSecondary }}>
                    {milestone.current.toFixed(0)} / {milestone.target}
                  </span>
                </div>
                <Progress.Root style={{ height: 6, background: colors.progressBg, borderRadius: 3, overflow: 'hidden' }} value={progress}>
                  <Progress.Indicator style={{ height: '100%', background: milestone.completed ? colors.success : colors.primary, transition: 'width 0.3s' }} />
                </Progress.Root>
              </div>
            );
          })}
        </div>
      </IosCard>

      {/* In Progress */}
      {activeAchievements.length > 0 && (
        <IosCard>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: colors.textSecondary, marginBottom: 12 }}>进行中</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeAchievements.slice(0, 3).map((achievement) => {
              const progress = achievement.target > 0 ? Math.min((achievement.progress / achievement.target) * 100, 100) : 0;
              return (
                <div key={achievement.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontSize: 24, marginRight: 12 }}>{achievement.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{achievement.title}</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>{achievement.progress} / {achievement.target}</div>
                  </div>
                  <IosProgress percentage={progress} size={40} strokeWidth={4} showLabel={false} />
                </div>
              );
            })}
          </div>
        </IosCard>
      )}

      {/* Unlocked */}
      {unlockedAchievements.length > 0 && (
        <IosCard>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: colors.textSecondary, marginBottom: 12 }}>已解锁</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {unlockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  background: 'rgba(255,204,0,0.1)',
                  borderRadius: 20,
                  border: '1px solid rgba(255,204,0,0.3)',
                }}
              >
                <span style={{ fontSize: 18 }}>{achievement.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{achievement.title}</span>
              </div>
            ))}
          </div>
        </IosCard>
      )}
    </div>
  );
}

function RemindersSection({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const { reminders, toggleReminder, addReminder } = useHealthStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', time: '09:00', repeatPattern: 'daily' as Reminder['repeatPattern'] });

  const handleAdd = () => {
    if (!newReminder.title.trim()) return;
    addReminder({ ...newReminder, type: 'custom', enabled: true, description: '' });
    setNewReminder({ title: '', time: '09:00', repeatPattern: 'daily' });
    setIsAdding(false);
  };

  return (
    <div>
      <IosCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: colors.textSecondary, margin: 0 }}>提醒列表</h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              background: colors.primary,
              color: 'white',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            添加
          </button>
        </div>

        {isAdding && (
          <div style={{ marginBottom: 16, padding: 12, background: colors.bgTertiary, borderRadius: 12 }}>
            <input
              type="text"
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              placeholder="提醒标题"
              className="input"
              style={{ marginBottom: 8 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="input"
                style={{ flex: 1 }}
              />
              <select
                value={newReminder.repeatPattern}
                onChange={(e) => setNewReminder({ ...newReminder, repeatPattern: e.target.value as Reminder['repeatPattern'] })}
                className="input"
                style={{ flex: 1 }}
              >
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </select>
            </div>
            <button onClick={handleAdd} className="btn btn-primary" style={{ width: '100%', marginTop: 8, padding: 10 }}>保存</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {reminders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: colors.textSecondary, fontSize: 14 }}>
              暂无提醒
            </div>
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: colors.bgSecondary,
                  borderRadius: 10,
                  opacity: reminder.enabled ? 1 : 0.5,
                }}
              >
                <Bell size={18} color={colors.primary} style={{ marginRight: 10 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{reminder.title}</div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>
                    {reminder.time} · {reminder.repeatPattern === 'daily' ? '每天' : reminder.repeatPattern === 'weekly' ? '每周' : '每月'}
                  </div>
                </div>
                <Switch.Root
                  checked={reminder.enabled}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                  style={{
                    width: 44,
                    height: 26,
                    background: reminder.enabled ? colors.success : colors.progressBg,
                    borderRadius: 13,
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <Switch.Thumb style={{
                    display: 'block',
                    width: 22,
                    height: 22,
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'transform 0.2s',
                    transform: reminder.enabled ? 'translateX(20px)' : 'translateX(2px)',
                  }} />
                </Switch.Root>
              </div>
            ))
          )}
        </div>
      </IosCard>

      {/* Medical Suggestions */}
      <IosCard>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Heart size={18} color={colors.success} style={{ marginRight: 10, marginTop: 2 }} />
          <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 500, color: colors.success, marginBottom: 4 }}>医学建议</div>
            <div>• 肝功能检查: 每3个月</div>
            <div>• 肝脏超声: 每6个月</div>
            <div>• 减重5-10%可改善脂肪肝</div>
          </div>
        </div>
      </IosCard>
    </div>
  );
}
