import { useEffect, useMemo } from 'react';
import { useHealthStore } from '../stores/healthStore';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, Activity, Flame } from 'lucide-react';
import { useResponsive, useThemeColors } from '../hooks/useResponsive';
import { IosCard, IosProgress } from '../components/ios/IosComponents';

export function Trend() {
  const store = useHealthStore();
  const { profile, weightLogs, exerciseLogs, currentStreak } = store;
  const { isMobile } = useResponsive();
  const colors = useThemeColors();

  useEffect(() => {
    store.calculateStreak();
  }, []);

  // 体重趋势数据
  const weightData = useMemo(() => {
    const logs = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return logs.slice(-14).map((log) => ({ date: log.date.slice(5), weight: log.weight }));
  }, [weightLogs]);

  // 本周运动数据
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

  // 统计数据
  const stats = useMemo(() => {
    const totalExercise = exerciseLogs.reduce((sum, log) => sum + log.duration, 0);
    const weeklyTotal = weeklyExerciseData.reduce((sum, d) => sum + d.duration, 0);
    const weeklyTarget = profile ? profile.targetExerciseMinutes * 7 : 210;
    return {
      totalExercise,
      weeklyTotal,
      weeklyTarget,
      weeklyPercentage: weeklyTarget > 0 ? Math.round((weeklyTotal / weeklyTarget) * 100) : 0,
    };
  }, [exerciseLogs, weeklyExerciseData, profile]);

  if (!profile) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: colors.textSecondary }}>
        请先在首页完成个人资料设置
      </div>
    );
  }

  return (
    <div style={{ maxWidth: isMobile ? '100%' : 500, margin: '0 auto' }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <IosCard style={{ textAlign: 'center', padding: 16 }}>
          <Flame size={24} color={colors.warning} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>{currentStreak}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>连续天数</div>
        </IosCard>
        <IosCard style={{ textAlign: 'center', padding: 16 }}>
          <Activity size={24} color={colors.primary} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>{stats.weeklyTotal}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>本周分钟</div>
        </IosCard>
        <IosCard style={{ textAlign: 'center', padding: 16 }}>
          <TrendingDown size={24} color={colors.success} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>{profile.currentWeight?.toFixed(1)}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>当前体重</div>
        </IosCard>
      </div>

      {/* Weekly Exercise Progress */}
      <IosCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: colors.text, margin: 0 }}>本周运动</h2>
            <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
              目标 {stats.weeklyTarget} 分钟
            </p>
          </div>
          <IosProgress percentage={stats.weeklyPercentage} size={60} strokeWidth={6} />
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyExerciseData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: colors.chartAxis }} stroke={colors.chartAxis} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: colors.chartAxis }} stroke={colors.chartAxis} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => [`${value} 分钟`, '运动时长']}
            />
            <Bar dataKey="duration" fill={colors.primary} radius={[4, 4, 0, 0]} name="运动时长" />
          </BarChart>
        </ResponsiveContainer>
      </IosCard>

      {/* Weight Trend */}
      <IosCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: colors.text, margin: 0 }}>体重趋势</h2>
            <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
              目标 {profile.targetWeight} kg
            </p>
          </div>
        </div>
        {weightData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: colors.chartAxis }} stroke={colors.chartAxis} axisLine={false} tickLine={false} />
                <YAxis domain={[(dataMin: number) => Math.floor(dataMin - 2), (dataMax: number) => Math.ceil(dataMax + 2)]} tick={{ fontSize: 11, fill: colors.chartAxis }} stroke={colors.chartAxis} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="weight" stroke={colors.success} strokeWidth={2.5} dot={{ fill: colors.success, r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            {profile.initialWeight && profile.currentWeight && profile.initialWeight > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${colors.border}`, fontSize: 13 }}>
                <span style={{ color: colors.textSecondary }}>初始 {profile.initialWeight} kg</span>
                <span style={{ color: colors.success, fontWeight: 500 }}>
                  ↓ {(((profile.initialWeight - profile.currentWeight) / profile.initialWeight) * 100).toFixed(1)}%
                </span>
                <span style={{ color: colors.textSecondary }}>目标 {profile.targetWeight} kg</span>
              </div>
            )}
          </>
        ) : (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textTertiary }}>
            暂无体重数据，请在今日页面记录体重
          </div>
        )}
      </IosCard>

      {/* Weight Change */}
      {profile.initialWeight && profile.currentWeight && (
        <IosCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 15, color: colors.textSecondary }}>累计变化</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.success, marginTop: 4 }}>
                {(profile.initialWeight - profile.currentWeight) > 0 ? '-' : '+'}{Math.abs(profile.initialWeight - profile.currentWeight).toFixed(1)} kg
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, color: colors.textSecondary }}>达成率</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.primary, marginTop: 4 }}>
                {(((profile.initialWeight - profile.targetWeight) > 0
                  ? (profile.initialWeight - profile.currentWeight) / (profile.initialWeight - profile.targetWeight)
                  : (profile.currentWeight - profile.initialWeight) / (profile.targetWeight - profile.initialWeight)) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </IosCard>
      )}
    </div>
  );
}
