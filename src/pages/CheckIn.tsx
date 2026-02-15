import { useState, useEffect, useMemo } from 'react';
import { useHealthStore } from '../stores/healthStore';
import type { ExerciseType, Mood } from '../types/health';
import { Activity, UtensilsCrossed, Scale, Smile, Save, Check } from 'lucide-react';
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

const cardStyle: React.CSSProperties = { background: 'white', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 20 };

export function CheckIn() {
  const store = useHealthStore();
  const { profile, todayRecord, setTodayRecord, saveRecord, addExerciseLog, addWeightLog, updateProfile } = store;
  const [exerciseType, setExerciseType] = useState<ExerciseType>('walking');
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  // 计算卡路里消耗
  const calorieInfo = useMemo(() => {
    if (!profile?.currentWeight) return null;
    return calculateCalories(exerciseType, exerciseDuration, profile.currentWeight);
  }, [exerciseType, exerciseDuration, profile?.currentWeight]);

  useEffect(() => {
    if (!todayRecord) {
      setTodayRecord({ id: `record-${Date.now()}`, date: new Date().toISOString().split('T')[0], exerciseCompleted: false, exerciseDuration: 0, breakfastCompleted: false, lunchCompleted: false, dinnerCompleted: false, mood: 3, notes: '' });
    }
  }, [todayRecord, setTodayRecord]);

  useEffect(() => {
    if (profile?.currentWeight) setWeight(profile.currentWeight.toString());
    if (todayRecord?.notes) setNotes(todayRecord.notes);
  }, [profile, todayRecord]);

  const handleExercise = () => {
    const newRecord = { ...todayRecord!, exerciseCompleted: true, exerciseDuration, exerciseType };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
    addExerciseLog({ date: todayRecord!.date, type: exerciseType, duration: exerciseDuration });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleMeal = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    const newRecord = { ...todayRecord!, [`${meal}Completed`]: !todayRecord![`${meal}Completed` as keyof typeof todayRecord] };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
  };

  const handleMood = (mood: Mood) => {
    const newRecord = { ...todayRecord!, mood };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
  };

  const handleWeight = () => {
    const v = parseFloat(weight);
    if (isNaN(v)) return;
    const newRecord = { ...todayRecord!, weight: v };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
    addWeightLog({ date: todayRecord!.date, weight: v });
    updateProfile({ currentWeight: v });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNotes = () => {
    const newRecord = { ...todayRecord!, notes };
    setTodayRecord(newRecord);
    saveRecord(newRecord);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile) return <div style={{ padding: 40, textAlign: 'center', color: '#86868b' }}>请先在首页完成个人资料设置</div>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 34, fontWeight: 700, color: '#1d1d1f', marginBottom: 24 }}>每日打卡</h1>

      {saved && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#1d1d1f', color: 'white', padding: '12px 20px', borderRadius: 14, display: 'flex', alignItems: 'center', zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <Check size={18} style={{ marginRight: 8 }} /> 已保存
        </div>
      )}

      {/* 运动 */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(0,122,255,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Activity size={24} color="#007aff" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>运动</h2>
              <p style={{ fontSize: 14, color: '#86868b', margin: '4px 0 0 0' }}>目标: {profile.targetExerciseMinutes} 分钟</p>
            </div>
          </div>
          {todayRecord?.exerciseCompleted ? (
            <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, background: 'rgba(52,199,89,0.15)', color: '#34c759' }}>已完成 {todayRecord.exerciseDuration} 分钟</span>
          ) : (
            <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, background: 'rgba(255,149,0,0.15)', color: '#ff9500' }}>待完成</span>
          )}
        </div>

        {!todayRecord?.exerciseCompleted ? (
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#1d1d1f', marginBottom: 12 }}>运动类型</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 20 }}>
              {exerciseTypes.map(e => (
                <button key={e.type} onClick={() => setExerciseType(e.type)} style={{ padding: 12, borderRadius: 14, border: exerciseType === e.type ? '2px solid #007aff' : '2px solid #e5e5ea', background: exerciseType === e.type ? 'rgba(0,122,255,0.08)' : 'transparent', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 24 }}>{e.icon}</div>
                  <div style={{ fontSize: 12, color: '#86868b', marginTop: 4 }}>{e.label}</div>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#1d1d1f', marginBottom: 12 }}>时长</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {durations.map(d => (
                <button key={d} onClick={() => setExerciseDuration(d)} style={{ padding: '10px 20px', borderRadius: 12, border: exerciseDuration === d ? '2px solid #007aff' : '2px solid #e5e5ea', background: exerciseDuration === d ? 'rgba(0,122,255,0.08)' : 'transparent', color: exerciseDuration === d ? '#007aff' : '#86868b', fontWeight: 500, cursor: 'pointer' }}>{d} 分钟</button>
              ))}
            </div>
            {calorieInfo && (
              <p style={{ fontSize: 13, color: '#34c759', marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                🔥 预计消耗约 <span style={{ fontWeight: 600, marginLeft: 4 }}>{calorieInfo.calories}</span> 千卡
              </p>
            )}
            <button onClick={handleExercise} className="btn btn-primary" style={{ width: '100%', padding: 16 }}>
              <Check size={18} style={{ marginRight: 8 }} /> 完成打卡
            </button>
          </div>
        ) : (
          <div style={{ background: 'rgba(52,199,89,0.1)', padding: 16, borderRadius: 14, display: 'flex', alignItems: 'center' }}>
            <Check size={20} color="#34c759" style={{ marginRight: 10 }} />
            <span style={{ fontWeight: 500, color: '#34c759' }}>今日已完成 {todayRecord.exerciseDuration} 分钟 {exerciseTypes.find(e => e.type === todayRecord.exerciseType)?.label}</span>
          </div>
        )}
      </div>

      {/* 饮食 */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(255,149,0,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <UtensilsCrossed size={24} color="#ff9500" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>饮食</h2>
            <p style={{ fontSize: 14, color: '#86868b', margin: '4px 0 0 0' }}>记录三餐情况</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {(['breakfast', 'lunch', 'dinner'] as const).map(meal => {
            const completed = todayRecord?.[`${meal}Completed` as keyof typeof todayRecord];
            return (
              <button key={meal} onClick={() => handleMeal(meal)} style={{ padding: 16, borderRadius: 14, border: completed ? '2px solid #ff9500' : '2px solid #e5e5ea', background: completed ? 'rgba(255,149,0,0.08)' : 'transparent', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 28 }}>{meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f', marginTop: 8 }}>{meal === 'breakfast' ? '早餐' : meal === 'lunch' ? '午餐' : '晚餐'}</div>
                <div style={{ fontSize: 13, color: completed ? '#ff9500' : '#aeaeb2', marginTop: 4 }}>{completed ? '✓ 已吃' : '未记录'}</div>
              </button>
            );
          })}
        </div>

        {/* 饮食建议 */}
        <div style={{ marginTop: 16, padding: 14, background: 'rgba(255,149,0,0.08)', borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: '#ff9500', margin: 0, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 6 }}>💡</span>
            建议采用地中海饮食：多蔬菜、水果、全谷物，少油炸、高糖食品
          </p>
        </div>
      </div>

      {/* 体重 */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(175,82,222,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <Scale size={24} color="#af52de" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>体重</h2>
            <p style={{ fontSize: 14, color: '#86868b', margin: '4px 0 0 0' }}>当前: {profile.currentWeight?.toFixed(1)} kg · 目标: {profile.targetWeight} kg</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} step="0.1" className="input" placeholder="今日体重" style={{ flex: 1 }} />
          <button onClick={handleWeight} className="btn btn-primary"><Save size={16} style={{ marginRight: 6 }} />保存</button>
        </div>
        {profile.initialWeight && profile.currentWeight && (
          <p style={{ fontSize: 13, color: '#86868b', marginTop: 10 }}>初始: {profile.initialWeight} kg · 已减 <span style={{ color: '#34c759', fontWeight: 600 }}>{(((profile.initialWeight - profile.currentWeight) / profile.initialWeight) * 100).toFixed(1)}%</span></p>
        )}
      </div>

      {/* 心情 */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(255,204,0,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <Smile size={24} color="#ffcc00" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>心情</h2>
            <p style={{ fontSize: 14, color: '#86868b', margin: '4px 0 0 0' }}>记录今日状态</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {moods.map((emoji, i) => (
            <button key={i} onClick={() => handleMood((i + 1) as Mood)} style={{ width: 48, height: 48, borderRadius: 24, background: todayRecord?.mood === i + 1 ? '#007aff' : '#f2f2f7', border: 'none', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{emoji}</button>
          ))}
        </div>
      </div>

      {/* 备注 */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', marginBottom: 16 }}>备注</h2>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} onBlur={handleNotes} className="input" rows={3} placeholder="记录饮食、运动感受..." style={{ resize: 'none' }} />
      </div>
    </div>
  );
}
