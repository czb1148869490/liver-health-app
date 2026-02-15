import { useEffect } from 'react';
import { useHealthStore } from '../stores/healthStore';
import { Trophy, Lock, Star, Flame, Target, Activity, Scale, UtensilsCrossed } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import { useResponsive, useCardStyle } from '../hooks/useResponsive';

export function Achievements() {
  const store = useHealthStore();
  const { achievements, points, milestones } = store;
  const { isMobile } = useResponsive();
  const cardStyle = useCardStyle();

  useEffect(() => {
    store.calculateStreak();
    store.updateMilestones();
    store.checkAndUpdateAchievements();
  }, []);

  const totalPoints = achievements.filter((a) => a.unlockedAt).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case '🌟': return <Star size={24} color="#ffcc00" />;
      case '🏃': return <Flame size={24} color="#ff9500" />;
      case '💪': return <Activity size={24} color="#007aff" />;
      case '🏆': return <Trophy size={24} color="#af52de" />;
      case '🏋️': return <Activity size={24} color="#34c759" />;
      case '🎯': return <Target size={24} color="#ff3b30" />;
      case '⭐': return <Star size={24} color="#007aff" />;
      case '📉': return <Scale size={24} color="#34c759" />;
      case '🎉': return <Trophy size={24} color="#ffcc00" />;
      case '🍽️': return <UtensilsCrossed size={24} color="#ff9500" />;
      default: return <Trophy size={24} color="#86868b" />;
    }
  };

  const streakAchievements = achievements.filter((a) => ['streak_7', 'streak_15', 'streak_30'].includes(a.id));
  const exerciseAchievements = achievements.filter((a) => ['exercise_first', 'exercise_10', 'exercise_500'].includes(a.id));
  const weightAchievements = achievements.filter((a) => ['weight_loss_5', 'weight_loss_10'].includes(a.id));
  const otherAchievements = achievements.filter((a) => !['streak_7', 'streak_15', 'streak_30', 'exercise_first', 'exercise_10', 'exercise_500', 'weight_loss_5', 'weight_loss_10'].includes(a.id));

  return (
    <div style={{ maxWidth: isMobile ? '100%' : 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 700, color: '#1d1d1f', marginBottom: isMobile ? 16 : 24 }}>成就徽章</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        <div style={{ background: 'linear-gradient(135deg, #ffcc00, #ff9500)', borderRadius: 20, padding: 24, color: 'white' }}>
          <Trophy size={32} style={{ opacity: 0.8, marginBottom: 8 }} />
          <p style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>{points}</p>
          <p style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>当前积分</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #34c759, #30d158)', borderRadius: 20, padding: 24, color: 'white' }}>
          <Star size={32} style={{ opacity: 0.8, marginBottom: 8 }} />
          <p style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>{totalPoints}</p>
          <p style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>累计获得</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #007aff, #5856d6)', borderRadius: 20, padding: 24, color: 'white' }}>
          <Trophy size={32} style={{ opacity: 0.8, marginBottom: 8 }} />
          <p style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>{unlockedCount}/{achievements.length}</p>
          <p style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>解锁成就</p>
        </div>
      </div>

      {/* Milestones */}
      <div style={{ ...cardStyle, marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', marginBottom: 20 }}>里程碑进度</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              style={{
                padding: 16,
                borderRadius: 14,
                background: milestone.completed ? 'rgba(52,199,89,0.08)' : '#f2f2f7',
                border: milestone.completed ? '1px solid rgba(52,199,89,0.3)' : '1px solid #e5e5ea',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>{milestone.title}</span>
                {milestone.completed ? (
                  <span style={{ padding: '4px 10px', background: '#34c759', color: 'white', fontSize: 11, fontWeight: 600, borderRadius: 20 }}>已完成</span>
                ) : (
                  <span style={{ padding: '4px 10px', background: '#e5e5ea', color: '#86868b', fontSize: 11, fontWeight: 600, borderRadius: 20 }}>进行中</span>
                )}
              </div>
              <p style={{ fontSize: 13, color: '#86868b', margin: '0 0 12px 0' }}>{milestone.description}</p>
              <Progress.Root style={{ height: 6, background: '#e5e5ea', borderRadius: 3, overflow: 'hidden' }} value={(milestone.current / milestone.target) * 100}>
                <Progress.Indicator
                  style={{
                    height: '100%',
                    borderRadius: 3,
                    background: milestone.completed ? '#34c759' : '#007aff',
                    transition: 'width 0.3s ease',
                    width: `${Math.min((milestone.current / milestone.target) * 100, 100)}%`,
                  }}
                />
              </Progress.Root>
              <p style={{ fontSize: 11, color: '#aeaeb2', marginTop: 8, textAlign: 'right' }}>{milestone.current} / {milestone.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Achievements */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1d1d1f', marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <Flame size={20} color="#ff9500" style={{ marginRight: 8 }} /> 坚持打卡
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {streakAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} getAchievementIcon={getAchievementIcon} />
          ))}
        </div>
      </div>

      {/* Exercise Achievements */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1d1d1f', marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <Activity size={20} color="#007aff" style={{ marginRight: 8 }} /> 运动达人
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {exerciseAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} getAchievementIcon={getAchievementIcon} />
          ))}
        </div>
      </div>

      {/* Weight Achievements */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1d1d1f', marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <Scale size={20} color="#34c759" style={{ marginRight: 8 }} /> 减重目标
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {weightAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} getAchievementIcon={getAchievementIcon} />
          ))}
        </div>
      </div>

      {/* Other Achievements */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1d1d1f', marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <Star size={20} color="#ffcc00" style={{ marginRight: 8 }} /> 其他成就
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {otherAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} getAchievementIcon={getAchievementIcon} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ achievement, getAchievementIcon }: {
  achievement: ReturnType<typeof useHealthStore.getState>['achievements'][0];
  getAchievementIcon: (icon: string) => React.ReactNode;
}) {
  const isUnlocked = !!achievement.unlockedAt;
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 18,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: isUnlocked ? '1px solid rgba(255,204,0,0.3)' : '1px solid #e5e5ea',
        opacity: isUnlocked ? 1 : 0.7,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isUnlocked ? 'rgba(255,204,0,0.15)' : '#f2f2f7',
          }}
        >
          {isUnlocked ? getAchievementIcon(achievement.icon) : <Lock size={24} color="#aeaeb2" />}
        </div>
        {isUnlocked && (
          <span style={{ padding: '4px 10px', background: '#ffcc00', color: 'white', fontSize: 12, fontWeight: 600, borderRadius: 20 }}>
            +{achievement.points} 积分
          </span>
        )}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f', margin: '0 0 6px 0' }}>{achievement.title}</h3>
      <p style={{ fontSize: 13, color: '#86868b', margin: '0 0 12px 0', lineHeight: 1.4 }}>{achievement.description}</p>
      {!isUnlocked && (
        <>
          <Progress.Root style={{ height: 4, background: '#e5e5ea', borderRadius: 2, overflow: 'hidden' }} value={(achievement.progress / achievement.target) * 100}>
            <Progress.Indicator
              style={{
                height: '100%',
                borderRadius: 2,
                background: '#007aff',
                transition: 'width 0.3s ease',
                width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
              }}
            />
          </Progress.Root>
          <p style={{ fontSize: 11, color: '#aeaeb2', marginTop: 8 }}>{achievement.progress} / {achievement.target}</p>
        </>
      )}
    </div>
  );
}
