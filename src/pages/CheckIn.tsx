import { useState, useEffect, useMemo } from 'react';
import { useHealthStore } from '../stores/healthStore';
import type { ExerciseType, Mood } from '../types/health';
import { Activity, UtensilsCrossed, Scale, Smile, Save, Check } from 'lucide-react';
import { calculateCalories } from '../utils/calories';
import { useResponsive, useCardStyle, useThemeColors } from '../hooks/useResponsive';
import { IosToast, IosConfirm } from '../components/ios/IosComponents';
import { impactLight, success } from '../utils/haptics';

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

export function CheckIn() {
  const store = useHealthStore();
  const { profile, todayRecord, setTodayRecord, saveRecord, addExerciseLog, addWeightLog, updateProfile, getTodayRecord } = store;
  const { isMobile } = useResponsive();
  const cardStyle = useCardStyle();
  const colors = useThemeColors();
  const [exerciseType, setExerciseType] = useState<ExerciseType>('walking');
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    meal: 'breakfast' | 'lunch' | 'dinner' | null;
  }>({ open: false, meal: null });

  // 获取今日记录（自动处理跨天更新）
  const currentRecord = todayRecord?.date === store.getTodayDate() ? todayRecord : getTodayRecord();

  // 计算卡路里消耗
  const calorieInfo = useMemo(() => {
    if (!profile?.currentWeight) return null;
    return calculateCalories(exerciseType, exerciseDuration, profile.currentWeight);
  }, [exerciseType, exerciseDuration, profile?.currentWeight]);

  useEffect(() => {
    store.initTodayRecord();
  }, [store]);

  useEffect(() => {
    if (profile?.currentWeight) setWeight(profile.currentWeight.toString());
    if (currentRecord?.notes) setNotes(currentRecord.notes);
  }, [profile, currentRecord]);

  const handleExercise = () => {
    if (!currentRecord) return;
    const newRecord = { ...currentRecord, exerciseCompleted: true, exerciseDuration, exerciseType };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
    addExerciseLog({ date: currentRecord.date, type: exerciseType, duration: exerciseDuration });
    success();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleMealClick = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    if (!currentRecord) return;
    const isCurrentlyCompleted = currentRecord[`${meal}Completed` as keyof typeof currentRecord];

    // 如果要取消已完成的状态，显示确认对话框
    if (isCurrentlyCompleted) {
      setConfirmState({ open: true, meal });
      return;
    }

    // 直接更新
    impactLight();
    const newRecord = { ...currentRecord, [`${meal}Completed`]: true };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
  };

  const confirmCancelMeal = () => {
    if (!currentRecord || !confirmState.meal) return;
    impactLight();
    const newRecord = { ...currentRecord, [`${confirmState.meal}Completed`]: false };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
    setConfirmState({ open: false, meal: null });
  };

  const handleMood = (mood: Mood) => {
    if (!currentRecord) return;
    const newRecord = { ...currentRecord, mood };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
  };

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

  const handleNotes = () => {
    if (!currentRecord) return;
    const newRecord = { ...currentRecord, notes };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
    success();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile) return <div style={{ padding: 40, textAlign: 'center', color: colors.textSecondary }}>请先在首页完成个人资料设置</div>;

  return (
    <div style={{ maxWidth: isMobile ? '100%' : 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 700, color: colors.text, marginBottom: isMobile ? 16 : 24 }}>每日打卡</h1>

      {saved && (
        <IosToast message="已保存" type="success" />
      )}

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

      {/* 运动 */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(0,122,255,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Activity size={24} color={colors.primary} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, margin: 0 }}>运动</h2>
              <p style={{ fontSize: 14, color: colors.textSecondary, margin: '4px 0 0 0' }}>目标: {profile.targetExerciseMinutes} 分钟</p>
            </div>
          </div>
          {currentRecord?.exerciseCompleted ? (
            <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, background: colors.badgeGreenBg, color: colors.badgeGreenText }}>已完成 {currentRecord.exerciseDuration} 分钟</span>
          ) : (
            <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, background: colors.badgeOrangeBg, color: colors.badgeOrangeText }}>待完成</span>
          )}
        </div>

        {!currentRecord?.exerciseCompleted ? (
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 12 }}>运动类型</p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: isMobile ? 10 : 8, marginBottom: 20 }}>
              {exerciseTypes.map(e => (
                <button key={e.type} onClick={() => setExerciseType(e.type)} style={{ padding: 12, borderRadius: 14, border: exerciseType === e.type ? `2px solid ${colors.primary}` : `2px solid ${colors.border}`, background: exerciseType === e.type ? 'rgba(0,122,255,0.08)' : 'transparent', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 24 }}>{e.icon}</div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>{e.label}</div>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 12 }}>时长</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {durations.map(d => (
                <button key={d} onClick={() => setExerciseDuration(d)} style={{ padding: '10px 20px', borderRadius: 12, border: exerciseDuration === d ? `2px solid ${colors.primary}` : `2px solid ${colors.border}`, background: exerciseDuration === d ? 'rgba(0,122,255,0.08)' : 'transparent', color: exerciseDuration === d ? colors.primary : colors.textSecondary, fontWeight: 500, cursor: 'pointer' }}>{d} 分钟</button>
              ))}
            </div>
            {calorieInfo && (
              <p style={{ fontSize: 13, color: colors.success, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                🔥 预计消耗约 <span style={{ fontWeight: 600, marginLeft: 4 }}>{calorieInfo.calories}</span> 千卡
              </p>
            )}
            <button onClick={handleExercise} className="btn btn-primary" style={{ width: '100%', padding: 16 }}>
              <Check size={18} style={{ marginRight: 8 }} /> 完成打卡
            </button>
          </div>
        ) : (
          <div style={{ background: 'rgba(52,199,89,0.1)', padding: 16, borderRadius: 14, display: 'flex', alignItems: 'center' }}>
            <Check size={20} color={colors.success} style={{ marginRight: 10 }} />
            <span style={{ fontWeight: 500, color: colors.success }}>今日已完成 {currentRecord.exerciseDuration} 分钟 {exerciseTypes.find(e => e.type === currentRecord.exerciseType)?.label}</span>
          </div>
        )}
      </div>

      {/* 饮食 */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(255,149,0,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <UtensilsCrossed size={24} color={colors.warning} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, margin: 0 }}>饮食</h2>
            <p style={{ fontSize: 14, color: colors.textSecondary, margin: '4px 0 0 0' }}>记录三餐情况</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {(['breakfast', 'lunch', 'dinner'] as const).map(meal => {
            const completed = currentRecord?.[`${meal}Completed` as keyof typeof currentRecord];
            return (
              <button key={meal} onClick={() => handleMealClick(meal)} style={{ padding: 16, borderRadius: 14, border: completed ? `2px solid ${colors.warning}` : `2px solid ${colors.border}`, background: completed ? 'rgba(255,149,0,0.08)' : 'transparent', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 28 }}>{meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, marginTop: 8 }}>{meal === 'breakfast' ? '早餐' : meal === 'lunch' ? '午餐' : '晚餐'}</div>
                <div style={{ fontSize: 13, color: completed ? colors.warning : colors.textTertiary, marginTop: 4 }}>{completed ? '✓ 已吃' : '未记录'}</div>
              </button>
            );
          })}
        </div>

        {/* 饮食建议 */}
        <div style={{ marginTop: 16, padding: 14, background: 'rgba(255,149,0,0.08)', borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: colors.warning, margin: 0, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 6 }}>💡</span>
            建议采用地中海饮食：多蔬菜、水果、全谷物，少油炸、高糖食品
          </p>
        </div>
      </div>

      {/* 体重 */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(175,82,222,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <Scale size={24} color={colors.purple} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, margin: 0 }}>体重</h2>
            <p style={{ fontSize: 14, color: colors.textSecondary, margin: '4px 0 0 0' }}>当前: {profile.currentWeight?.toFixed(1)} kg · 目标: {profile.targetWeight} kg</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} step="0.1" className="input" placeholder="今日体重" style={{ flex: 1 }} />
          <button onClick={handleWeight} className="btn btn-primary"><Save size={18} style={{ marginRight: 6 }} />保存</button>
        </div>
        {profile.initialWeight && profile.currentWeight && (
          <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 10 }}>初始: {profile.initialWeight} kg · 已减 <span style={{ color: colors.success, fontWeight: 600 }}>{(((profile.initialWeight - profile.currentWeight) / profile.initialWeight) * 100).toFixed(1)}%</span></p>
        )}
      </div>

      {/* 心情 */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(255,204,0,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <Smile size={24} color={colors.yellow} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, margin: 0 }}>心情</h2>
            <p style={{ fontSize: 14, color: colors.textSecondary, margin: '4px 0 0 0' }}>记录今日状态</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {moods.map((emoji, i) => (
            <button key={i} onClick={() => handleMood((i + 1) as Mood)} style={{ width: 48, height: 48, borderRadius: 24, background: currentRecord?.mood === i + 1 ? colors.primary : colors.bgTertiary, border: 'none', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{emoji}</button>
          ))}
        </div>
      </div>

      {/* 备注 */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 16 }}>备注</h2>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} onBlur={handleNotes} className="input" rows={3} placeholder="记录饮食、运动感受..." style={{ resize: 'none' }} />
      </div>
    </div>
  );
}
