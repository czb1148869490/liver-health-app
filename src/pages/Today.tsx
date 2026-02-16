import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHealthStore } from '../stores/healthStore';
import type { Mood, ExerciseType } from '../types/health';
import { Activity, Scale, Smile, ArrowRight, TrendingDown, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getTodayTip } from '../data/dailyTips';
import { useResponsive, useThemeColors } from '../hooks/useResponsive';
import { IosCard, IosListItem, IosProgress, IosToast, IosConfirm } from '../components/ios/IosComponents';
import { MoodButton } from '../components/ios/IosComponents';
import { impactLight, success } from '../utils/haptics';
import { calculateCalories } from '../utils/calories';

const exerciseTypes: { type: ExerciseType; label: string; icon: string }[] = [
  { type: 'walking', label: '快走', icon: '🚶' },
  { type: 'jogging', label: '慢跑', icon: '🏃' },
  { type: 'cycling', label: '骑行', icon: '🚴' },
  { type: 'yoga', label: '瑜伽', icon: '🧘' },
  { type: 'strength', label: '力量', icon: '🏋️' },
  { type: 'swimming', label: '游泳', icon: '🏊' },
];

const durations = [10, 20, 30, 45, 60];
const moods = ['😢', '😕', '😐', '🙂', '😊'];

export function Today() {
  const store = useHealthStore();
  const { profile, todayRecord, setTodayRecord, saveRecord, addExerciseLog, addWeightLog, updateProfile, getTodayRecord } = store;
  const { isMobile } = useResponsive();
  const colors = useThemeColors();

  const [progress, setProgress] = useState({ exercise: 0, meals: 0, total: 0, percentage: 0 });
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('walking');
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [weight, setWeight] = useState('');
  const [showTip, setShowTip] = useState(true);
  const [saved, setSaved] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    meal: 'breakfast' | 'lunch' | 'dinner' | null;
  }>({ open: false, meal: null });

  // 获取今日记录（自动处理跨天更新）
  const currentRecord = todayRecord?.date === store.getTodayDate() ? todayRecord : getTodayRecord();

  // 计算卡路里
  const calorieInfo = useMemo(() => {
    if (!profile?.currentWeight) return null;
    return calculateCalories(exerciseType, exerciseDuration, profile.currentWeight);
  }, [exerciseType, exerciseDuration, profile?.currentWeight]);

  useEffect(() => {
    store.initTodayRecord();
    store.calculateStreak();
    store.checkAndUpdateAchievements();
    setProgress(store.getTodayProgress());
  }, []);

  useEffect(() => {
    if (profile?.currentWeight) setWeight(profile.currentWeight.toString());
  }, [profile]);

  // 处理运动打卡
  const handleExerciseComplete = () => {
    if (!currentRecord) return;
    const newRecord = { ...currentRecord, exerciseCompleted: true, exerciseDuration, exerciseType };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
    addExerciseLog({ date: currentRecord.date, type: exerciseType, duration: exerciseDuration });
    success();
    setSaved(true);
    setShowExerciseModal(false);
    setProgress(store.getTodayProgress());
    setTimeout(() => setSaved(false), 2000);
  };

  // 处理餐饮打卡
  const handleMealClick = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    if (!currentRecord) return;
    const isCurrentlyCompleted = currentRecord[`${meal}Completed` as keyof typeof currentRecord];

    if (isCurrentlyCompleted) {
      setConfirmState({ open: true, meal });
      return;
    }

    impactLight();
    const newRecord = { ...currentRecord, [`${meal}Completed`]: true };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
    setProgress(store.getTodayProgress());
  };

  const confirmCancelMeal = () => {
    if (!currentRecord || !confirmState.meal) return;
    impactLight();
    const newRecord = { ...currentRecord, [`${confirmState.meal}Completed`]: false };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
    setConfirmState({ open: false, meal: null });
    setProgress(store.getTodayProgress());
  };

  // 处理心情
  const handleMood = (mood: Mood) => {
    if (!currentRecord) return;
    impactLight();
    const newRecord = { ...currentRecord, mood };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
  };

  // 处理体重
  const handleWeight = () => {
    if (!currentRecord) return;
    const v = parseFloat(weight);
    if (isNaN(v)) return;
    const newRecord = { ...currentRecord, weight: v };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
    addWeightLog({ date: currentRecord.date, weight: v });
    updateProfile({ currentWeight: v });
    success();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile || !profile.onboardingCompleted) {
    return <Onboarding />;
  }

  const tip = getTodayTip();

  return (
    <div style={{ maxWidth: isMobile ? '100%' : 500, margin: '0 auto' }}>
      {saved && <IosToast message="已保存" type="success" />}

      {confirmState.open && (
        <IosConfirm
          title="取消记录"
          message={`确定要取消${confirmState.meal === 'breakfast' ? '早餐' : confirmState.meal === 'lunch' ? '午餐' : '晚餐'}记录吗？`}
          confirmText="确定取消"
          cancelText="保留"
          onConfirm={confirmCancelMeal}
          onCancel={() => setConfirmState({ open: false, meal: null })}
          danger
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: colors.text, margin: 0 }}>
              早上好，{profile?.name || '朋友'}
            </h1>
            <p style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
              {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
            </p>
          </div>
          <Link to="/profile" style={{ padding: 8, textDecoration: 'none' }}>
            <Activity size={24} color={colors.textSecondary} />
          </Link>
        </div>
      </div>

      {/* Progress Ring */}
      <IosCard style={{ padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IosProgress percentage={progress.percentage} size={160} />
          <div style={{ marginTop: 16, fontSize: 17, fontWeight: 500, color: colors.text }}>
            今日已完成 {progress.total}/4
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 20, fontSize: 13 }}>
            <span style={{ color: currentRecord?.exerciseCompleted ? colors.success : colors.textTertiary }}>
              {currentRecord?.exerciseCompleted ? '✓' : '○'} 运动
            </span>
            <span style={{ color: currentRecord?.breakfastCompleted ? colors.warning : colors.textTertiary }}>
              {currentRecord?.breakfastCompleted ? '✓' : '○'} 早餐
            </span>
            <span style={{ color: currentRecord?.lunchCompleted ? colors.warning : colors.textTertiary }}>
              {currentRecord?.lunchCompleted ? '✓' : '○'} 午餐
            </span>
            <span style={{ color: currentRecord?.dinnerCompleted ? colors.warning : colors.textTertiary }}>
              {currentRecord?.dinnerCompleted ? '✓' : '○'} 晚餐
            </span>
          </div>
        </div>
      </IosCard>

      {/* Exercise */}
      <IosCard>
        <IosListItem onClick={() => currentRecord?.exerciseCompleted ? null : setShowExerciseModal(true)}>
          <div style={{ width: 40, height: 40, background: currentRecord?.exerciseCompleted ? 'rgba(52,199,89,0.15)' : 'rgba(0,122,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            {currentRecord?.exerciseCompleted ? (
              <Check size={20} color={colors.success} />
            ) : (
              <Activity size={20} color={colors.primary} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: colors.text }}>运动</div>
            {currentRecord?.exerciseCompleted ? (
              <div style={{ fontSize: 13, color: colors.success }}>
                {currentRecord.exerciseDuration} 分钟 · {exerciseTypes.find(e => e.type === currentRecord.exerciseType)?.label || '运动'}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: colors.textSecondary }}>点击完成运动打卡</div>
            )}
          </div>
          {!currentRecord?.exerciseCompleted && <ArrowRight size={18} color={colors.textTertiary} />}
        </IosListItem>
      </IosCard>

      {/* Meals */}
      <IosCard>
        <div style={{ padding: '0 4px', marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.textSecondary, marginBottom: 12 }}>饮食记录</div>
        </div>
        {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => {
          const completed = currentRecord?.[`${meal}Completed` as keyof typeof currentRecord];
          return (
            <IosListItem key={meal} onClick={() => handleMealClick(meal)}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 20, marginRight: 12 }}>
                  {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}
                </span>
                <span style={{ fontSize: 15, color: colors.text }}>
                  {meal === 'breakfast' ? '早餐' : meal === 'lunch' ? '午餐' : '晚餐'}
                </span>
              </div>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                border: completed ? 'none' : `2px solid ${colors.border}`,
                background: completed ? colors.warning : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {completed && <Check size={14} color="white" />}
              </div>
            </IosListItem>
          );
        })}
      </IosCard>

      {/* Weight */}
      <IosCard>
        <IosListItem>
          <div style={{ width: 40, height: 40, background: 'rgba(175,82,222,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <Scale size={20} color={colors.purple} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, color: colors.text }}>体重</span>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onBlur={handleWeight}
              step="0.1"
              placeholder="点击输入"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: 20,
                fontWeight: 600,
                color: colors.text,
                textAlign: 'right',
                outline: 'none',
              }}
            />
            <span style={{ fontSize: 14, color: colors.textSecondary }}>kg</span>
          </div>
        </IosListItem>
        {profile.initialWeight && profile.currentWeight && (
          <div style={{ padding: '0 4px', marginTop: 4, display: 'flex', alignItems: 'center', fontSize: 13, color: colors.success }}>
            <TrendingDown size={14} style={{ marginRight: 4 }} />
            {(((profile.initialWeight - profile.currentWeight) / profile.initialWeight) * 100).toFixed(1)}% (已减 {(profile.initialWeight - profile.currentWeight).toFixed(1)} kg)
          </div>
        )}
      </IosCard>

      {/* Mood */}
      <IosCard>
        <IosListItem>
          <div style={{ width: 40, height: 40, background: 'rgba(255,204,0,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <Smile size={20} color={colors.yellow} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, color: colors.text }}>心情</span>
          </div>
        </IosListItem>
        <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 8 }}>
          {moods.map((emoji, i) => (
            <MoodButton
              key={i}
              emoji={emoji}
              isSelected={currentRecord?.mood === i + 1}
              onClick={() => handleMood((i + 1) as Mood)}
              size={44}
            />
          ))}
        </div>
      </IosCard>

      {/* Daily Tip */}
      <IosCard onClick={() => setShowTip(!showTip)}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 24, marginRight: 12 }}>{tip.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.primary }}>今日建议</span>
              {showTip ? <ChevronUp size={18} color={colors.textSecondary} /> : <ChevronDown size={18} color={colors.textSecondary} />}
            </div>
            {showTip && (
              <p style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8, lineHeight: 1.5 }}>
                {tip.content}
              </p>
            )}
          </div>
        </div>
      </IosCard>

      {/* Exercise Modal */}
      {showExerciseModal && (
        <div className="ios-overlay" onClick={() => setShowExerciseModal(false)}>
          <div className="ios-dialog" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 20, textAlign: 'center' }}>运动打卡</h2>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 12 }}>运动类型</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {exerciseTypes.map((e) => (
                  <button
                    key={e.type}
                    onClick={() => setExerciseType(e.type)}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: exerciseType === e.type ? `2px solid ${colors.primary}` : `2px solid ${colors.border}`,
                      background: exerciseType === e.type ? 'rgba(0,122,255,0.08)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 24 }}>{e.icon}</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>{e.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 12 }}>时长 (分钟)</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setExerciseDuration(d)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 10,
                      border: exerciseDuration === d ? `2px solid ${colors.primary}` : `2px solid ${colors.border}`,
                      background: exerciseDuration === d ? 'rgba(0,122,255,0.08)' : 'transparent',
                      color: exerciseDuration === d ? colors.primary : colors.textSecondary,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {calorieInfo && (
              <p style={{ fontSize: 13, color: colors.success, marginBottom: 20, textAlign: 'center' }}>
                🔥 预计消耗约 <span style={{ fontWeight: 600 }}>{calorieInfo.calories}</span> 千卡
              </p>
            )}

            <button onClick={handleExerciseComplete} className="btn btn-primary" style={{ width: '100%', padding: 16 }}>
              <Check size={18} style={{ marginRight: 8 }} /> 完成打卡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Onboarding() {
  const { setProfile, completeOnboarding, profile: existingProfile } = useHealthStore();
  const { isMobile } = useResponsive();
  const colors = useThemeColors();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProfile = {
      id: `user-${Date.now()}`,
      name: formData.get('name') as string,
      height: Number(formData.get('height')),
      initialWeight: Number(formData.get('weight')),
      currentWeight: Number(formData.get('weight')),
      targetWeight: Number(formData.get('targetWeight')),
      fattyLiverLevel: formData.get('fattyLiverLevel') as 'mild' | 'moderate' | 'severe',
      targetExerciseMinutes: Number(formData.get('targetExerciseMinutes')) || 30,
      createdAt: Date.now(),
      onboardingCompleted: false,
    };
    setProfile(newProfile);
    completeOnboarding();
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: isMobile ? 16 : 0 }}>
      <IosCard>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Activity size={30} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: '0 0 8px 0' }}>欢迎开始健康之旅</h1>
          <p style={{ fontSize: 14, color: colors.textSecondary, margin: 0 }}>让我们了解一下你的基本情况</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 8 }}>你的名字</label>
            <input type="text" name="name" required defaultValue={existingProfile?.name} className="input" placeholder="请输入你的名字" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 8 }}>身高 (cm)</label>
              <input type="number" name="height" required defaultValue={existingProfile?.height} className="input" placeholder="170" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 8 }}>当前体重</label>
              <input type="number" name="weight" required step="0.1" defaultValue={existingProfile?.currentWeight} className="input" placeholder="75" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 8 }}>目标体重 (kg)</label>
            <input type="number" name="targetWeight" required step="0.1" defaultValue={existingProfile?.targetWeight} className="input" placeholder="65" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 8 }}>脂肪肝程度</label>
            <select name="fattyLiverLevel" defaultValue={existingProfile?.fattyLiverLevel || 'mild'} className="input">
              <option value="mild">轻度</option>
              <option value="moderate">中度</option>
              <option value="severe">重度</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 8 }}>每日运动目标</label>
            <select name="targetExerciseMinutes" defaultValue={existingProfile?.targetExerciseMinutes || 30} className="input">
              <option value="10">10 分钟 · 初学者</option>
              <option value="20">20 分钟</option>
              <option value="30">30 分钟 · 推荐</option>
              <option value="45">45 分钟</option>
              <option value="60">60 分钟</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
            开始旅程
          </button>
        </form>

        <div style={{ marginTop: 16, padding: 12, background: 'rgba(0,122,255,0.08)', borderRadius: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: colors.primary, margin: '0 0 8px 0' }}>💡 小贴士</p>
          <ul style={{ fontSize: 14, color: colors.primary, margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
            <li>减重 5-10% 可显著改善脂肪肝</li>
            <li>每周建议运动 150-300 分钟</li>
            <li>从小目标开始，更容易坚持</li>
          </ul>
        </div>
      </IosCard>
    </div>
  );
}
