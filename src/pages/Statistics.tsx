import { useEffect, useMemo } from 'react';
import { useHealthStore } from '../stores/healthStore';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, Activity, Calendar, Flame } from 'lucide-react';
import { useResponsive, useCardStyle } from '../hooks/useResponsive';

export function Statistics() {
  const store = useHealthStore();
  const { profile, weightLogs, exerciseLogs, records, currentStreak } = store;
  const { isMobile } = useResponsive();
  const cardStyle = useCardStyle();

  useEffect(() => { store.calculateStreak(); }, []);

  const weightData = useMemo(() => {
    const logs = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return logs.slice(-30).map((log) => ({ date: log.date.slice(5), weight: log.weight }));
  }, [weightLogs]);

  const weeklyExerciseData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const dayName = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
      const exerciseLog = exerciseLogs.find((log) => log.date === dateStr);
      data.push({ day: dayName, date: dateStr, duration: exerciseLog?.duration || 0 });
    }
    return data;
  }, [exerciseLogs]);

  const calendarData = useMemo(() => {
    const data: { date: string; status: number }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const record = records[dateStr];
      let status = 0;
      if (record) {
        const tasks = [record.exerciseCompleted, record.breakfastCompleted, record.lunchCompleted, record.dinnerCompleted].filter(Boolean).length;
        if (tasks >= 3) status = 2;
        else if (tasks >= 1) status = 1;
      }
      data.push({ date: dateStr, status });
    }
    return data;
  }, [records]);

  const stats = useMemo(() => {
    const totalExercise = exerciseLogs.reduce((sum, log) => sum + log.duration, 0);
    const totalDays = Object.keys(records).length;
    const completedDays = Object.values(records).filter((r) => r.exerciseCompleted || r.breakfastCompleted || r.lunchCompleted || r.dinnerCompleted).length;
    return { totalExercise, completionRate: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0 };
  }, [exerciseLogs, records]);

  if (!profile) return <div style={{ padding: 40, textAlign: 'center', color: '#86868b' }}>请先在首页完成个人资料设置</div>;

  return (
    <div style={{ maxWidth: isMobile ? '100%' : 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 700, color: '#1d1d1f', marginBottom: isMobile ? 16 : 24 }}>数据统计</h1>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ ...cardStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: 'rgba(0,122,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="#007aff" />
            </div>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#1d1d1f', margin: 0 }}>{stats.totalExercise}</p>
          <p style={{ fontSize: 13, color: '#86868b', marginTop: 4 }}>累计运动(分钟)</p>
        </div>

        <div style={{ ...cardStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: 'rgba(255,149,0,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} color="#ff9500" />
            </div>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#1d1d1f', margin: 0 }}>{currentStreak}</p>
          <p style={{ fontSize: 13, color: '#86868b', marginTop: 4 }}>连续打卡(天)</p>
        </div>

        <div style={{ ...cardStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: 'rgba(175,82,222,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} color="#af52de" />
            </div>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#1d1d1f', margin: 0 }}>{stats.completionRate}%</p>
          <p style={{ fontSize: 13, color: '#86868b', marginTop: 4 }}>打卡完成率</p>
        </div>

        <div style={{ ...cardStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: 'rgba(52,199,89,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={18} color="#34c759" />
            </div>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#1d1d1f', margin: 0 }}>{profile.currentWeight?.toFixed(1)}</p>
          <p style={{ fontSize: 13, color: '#86868b', marginTop: 4 }}>当前体重(kg)</p>
        </div>
      </div>

      {/* Weight Trend */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', marginBottom: 20 }}>体重趋势</h2>
        {weightData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis domain={[(dataMin: number) => Math.floor(dataMin - 2), (dataMax: number) => Math.ceil(dataMax + 2)]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="weight" stroke="#34c759" strokeWidth={2.5} dot={{ fill: '#34c759', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aeaeb2' }}>暂无体重数据，请先记录体重</div>
        )}
        {profile.initialWeight && profile.currentWeight && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13 }}>
            <span style={{ color: '#86868b' }}>初始: {profile.initialWeight} kg</span>
            <span style={{ color: '#34c759', fontWeight: 600 }}>已减 {(((profile.initialWeight - profile.currentWeight) / profile.initialWeight) * 100).toFixed(1)}% ({(profile.initialWeight - profile.currentWeight).toFixed(1)} kg)</span>
            <span style={{ color: '#86868b' }}>目标: {profile.targetWeight} kg</span>
          </div>
        )}
      </div>

      {/* Weekly Exercise */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', marginBottom: 20 }}>本周运动</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyExerciseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(value: number) => [`${value} 分钟`, '运动时长']} />
            <Bar dataKey="duration" fill="#007aff" radius={[6, 6, 0, 0]} name="运动时长" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13 }}>
          <span style={{ color: '#86868b' }}>本周总计: {weeklyExerciseData.reduce((sum, d) => sum + d.duration, 0)} 分钟</span>
          <span style={{ color: '#86868b' }}>目标: {profile.targetExerciseMinutes * 7} 分钟/周</span>
        </div>
      </div>

      {/* Calendar */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', marginBottom: 20 }}>打卡日历 (近30天)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
          {calendarData.map((day) => (
            <div
              key={day.date}
              style={{
                aspectRatio: '1',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 500,
                background: day.status === 0 ? '#f2f2f7' : day.status === 1 ? 'rgba(255,204,0,0.2)' : 'rgba(52,199,89,0.2)',
                color: day.status === 0 ? '#aeaeb2' : day.status === 1 ? '#b8860b' : '#34c759',
              }}
              title={day.date}
            >
              {day.date.slice(-2)}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, background: '#f2f2f7', borderRadius: 3 }}></div>
            <span style={{ fontSize: 12, color: '#86868b' }}>未打卡</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, background: 'rgba(255,204,0,0.2)', borderRadius: 3 }}></div>
            <span style={{ fontSize: 12, color: '#86868b' }}>部分完成</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, background: 'rgba(52,199,89,0.2)', borderRadius: 3 }}></div>
            <span style={{ fontSize: 12, color: '#86868b' }}>全部完成</span>
          </div>
        </div>
      </div>
    </div>
  );
}
