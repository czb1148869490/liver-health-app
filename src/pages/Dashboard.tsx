import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHealthStore } from '../stores/healthStore';
import { Activity, UtensilsCrossed, Scale, Smile, ArrowRight, Flame, TrendingDown, Target, Trophy, Heart, Lightbulb } from 'lucide-react';
import { getTodayTip } from '../data/dailyTips';

export function Dashboard() {
  const store = useHealthStore();
  const { profile, todayRecord, currentStreak, points } = store;
  const [progress, setProgress] = useState({ exercise: 0, meals: 0, total: 0, percentage: 0 });
  const [weeklyExercise, setWeeklyExercise] = useState(0);

  useEffect(() => {
    store.calculateStreak();
    store.updateMilestones();
    store.checkAndUpdateAchievements();
    setProgress(store.getTodayProgress());
    setWeeklyExercise(store.getWeeklyExercise());
  }, []);

  if (!profile || !profile.onboardingCompleted) {
    return <Onboarding />;
  }

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 18,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: 20,
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
          你好，{profile?.name || '朋友'}
        </h1>
        <p style={{ fontSize: 17, color: '#86868b', marginTop: 4 }}>
          今天是 #{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Daily Tip */}
      {(() => {
        const tip = getTodayTip();
        return (
          <Link to="/education" style={{ textDecoration: 'none', display: 'block', marginBottom: 24 }}>
            <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #5856d6, #007aff)', color: 'white', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, marginRight: 14 }}>{tip.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, opacity: 0.9, margin: '0 0 4px 0' }}>今日健康小贴士</p>
                  <p style={{ fontSize: 15, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{tip.title}</p>
                  <p style={{ fontSize: 13, opacity: 0.8, margin: '8px 0 0 0', lineHeight: 1.4 }}>{tip.content.slice(0, 60)}...</p>
                </div>
                <ArrowRight size={20} style={{ opacity: 0.7 }} />
              </div>
            </div>
          </Link>
        );
      })()}

      {/* Progress */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f' }}>今日进度</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: '#34c759' }}>{progress.percentage}%</span>
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
        </div>
        <p style={{ fontSize: 13, color: '#86868b', marginTop: 8 }}>{progress.total}/4 任务已完成 (运动+三餐)</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #007aff, #5856d6)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Flame size={28} />
            <span style={{ fontSize: 40, fontWeight: 700 }}>{currentStreak}</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 500, marginTop: 8 }}>连续打卡天数</p>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #34c759, #30d158)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Target size={28} />
            <span style={{ fontSize: 40, fontWeight: 700 }}>{weeklyExercise}</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 500, marginTop: 8 }}>本周运动(分钟)</p>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #ff9500, #ff3b30)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Trophy size={28} />
            <span style={{ fontSize: 40, fontWeight: 700 }}>{points}</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 500, marginTop: 8 }}>积分</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <Link to="/checkin" style={{ ...cardStyle, textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(0,122,255,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={24} color="#007aff" />
            </div>
            {todayRecord?.exerciseCompleted ? (
              <span className="badge badge-green">已完成</span>
            ) : (
              <span className="badge badge-orange">待完成</span>
            )}
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: '0 0 4px 0' }}>运动打卡</h3>
          <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>目标: {profile.targetExerciseMinutes} 分钟</p>
          <div style={{ display: 'flex', alignItems: 'center', color: '#007aff', fontSize: 15, fontWeight: 500, marginTop: 16 }}>
            立即打卡 <ArrowRight size={16} style={{ marginLeft: 4 }} />
          </div>
        </Link>

        <Link to="/checkin" style={{ ...cardStyle, textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,149,0,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UtensilsCrossed size={24} color="#ff9500" />
            </div>
            <span style={{ fontSize: 15, color: '#86868b' }}>
              {((todayRecord?.breakfastCompleted ? 1 : 0) + (todayRecord?.lunchCompleted ? 1 : 0) + (todayRecord?.dinnerCompleted ? 1 : 0))}/3 餐
            </span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: '0 0 4px 0' }}>饮食记录</h3>
          <p style={{ fontSize: 15, color: '#86868b', margin: 0 }}>
            早 {todayRecord?.breakfastCompleted ? '✓' : '○'} · 午 {todayRecord?.lunchCompleted ? '✓' : '○'} · 晚 {todayRecord?.dinnerCompleted ? '✓' : '○'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', color: '#ff9500', fontSize: 15, fontWeight: 500, marginTop: 16 }}>
            记录饮食 <ArrowRight size={16} style={{ marginLeft: 4 }} />
          </div>
        </Link>

        <div style={{ ...cardStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(175,82,222,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={24} color="#af52de" />
            </div>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: '0 0 4px 0' }}>体重</h3>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
            {profile.currentWeight?.toFixed(1) || '--'} <span style={{ fontSize: 15, fontWeight: 400, color: '#86868b' }}>kg</span>
          </p>
          {profile.initialWeight && (
            <p style={{ fontSize: 13, color: '#34c759', marginTop: 8, display: 'flex', alignItems: 'center' }}>
              <TrendingDown size={14} style={{ marginRight: 4 }} />
              {(((profile.initialWeight - profile.currentWeight) / profile.initialWeight) * 100).toFixed(1)}%
            </p>
          )}
        </div>

        <div style={{ ...cardStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,204,0,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smile size={24} color="#ffcc00" />
            </div>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: '0 0 4px 0' }}>心情</h3>
          <p style={{ fontSize: 15, color: '#86868b', marginBottom: 12 }}>
            {todayRecord?.mood ? ['很差', '较差', '一般', '良好', '很好'][todayRecord.mood - 1] : '未记录'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {['😢', '😕', '😐', '🙂', '😊'].map((emoji, i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  background: todayRecord?.mood === i + 1 ? '#007aff' : '#f2f2f7',
                  opacity: todayRecord?.mood === i + 1 ? 1 : 0.5,
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Onboarding() {
  const { setProfile, completeOnboarding, profile: existingProfile } = useHealthStore();

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

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    padding: 40,
    maxWidth: 400,
    margin: '80px auto',
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #ff6b6b, #ffa500)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(255,107,107,0.3)' }}>
            <Heart size={40} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1d1d1f', margin: '0 0 8px 0' }}>欢迎开始健康之旅</h1>
          <p style={{ fontSize: 17, color: '#86868b', margin: 0 }}>让我们了解一下你的基本情况</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>你的名字</label>
            <input type="text" name="name" required defaultValue={existingProfile?.name} className="input" placeholder="请输入你的名字" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>身高 (cm)</label>
              <input type="number" name="height" required defaultValue={existingProfile?.height} className="input" placeholder="170" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>当前体重</label>
              <input type="number" name="weight" required step="0.1" defaultValue={existingProfile?.currentWeight} className="input" placeholder="75" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>目标体重 (kg)</label>
            <input type="number" name="targetWeight" required step="0.1" defaultValue={existingProfile?.targetWeight} className="input" placeholder="65" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>脂肪肝程度</label>
            <select name="fattyLiverLevel" defaultValue={existingProfile?.fattyLiverLevel || 'mild'} className="input">
              <option value="mild">轻度</option>
              <option value="moderate">中度</option>
              <option value="severe">重度</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 15, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>每日运动目标</label>
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

        <div style={{ marginTop: 24, padding: 16, background: 'rgba(0,122,255,0.08)', borderRadius: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#007aff', margin: '0 0 8px 0' }}>💡 小贴士</p>
          <ul style={{ fontSize: 14, color: '#007aff', margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
            <li>减重 5-10% 可显著改善脂肪肝</li>
            <li>每周建议运动 150-300 分钟</li>
            <li>从小目标开始，更容易坚持</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
