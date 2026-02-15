import { useState } from 'react';
import { useHealthStore } from '../stores/healthStore';
import { BookOpen, Lightbulb, Target, Utensils, Activity, ChevronRight, X, Dumbbell } from 'lucide-react';
import { healthArticles, getCategoryName, Article } from '../data/healthArticles';
import { getTodayTip, getCategoryName as getTipCategoryName } from '../data/dailyTips';
import { generateExercisePrescription, calculateBMI, getBMICategory } from '../utils/exercisePrescription';
import { weeklyMealPlan, foodRecommendations, getTodayDietTip } from '../data/dietaryGuide';
import { healthIndicators, getCategoryName as getIndicatorCategoryName, getCategoryIcon } from '../data/healthIndicators';
import { useResponsive, useCardStyle, useThemeColors } from '../hooks/useResponsive';

type TabType = 'tips' | 'exercise' | 'diet' | 'articles' | 'indicators';

export function Education() {
  const { profile } = useHealthStore();
  const { isMobile } = useResponsive();
  const cardStyle = useCardStyle();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<TabType>('tips');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const todayTip = getTodayTip();
  const dietTip = getTodayDietTip();
  const bmi = profile ? calculateBMI(profile.height, profile.currentWeight) : 0;
  const bmiInfo = getBMICategory(bmi);
  const prescription = profile ? generateExercisePrescription(profile) : null;

  const tabs = [
    { id: 'tips' as TabType, label: '每日Tip', icon: Lightbulb },
    { id: 'exercise' as TabType, label: '运动处方', icon: Target },
    { id: 'diet' as TabType, label: '饮食指导', icon: Utensils },
    { id: 'articles' as TabType, label: '健康科普', icon: BookOpen },
    { id: 'indicators' as TabType, label: '指标解读', icon: Activity },
  ];

  return (
    <div style={{ maxWidth: isMobile ? '100%' : 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 700, color: colors.text, marginBottom: isMobile ? 16 : 24 }}>健康学院</h1>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: activeTab === tab.id ? colors.primary : colors.bgTertiary,
                color: activeTab === tab.id ? 'white' : colors.textSecondary,
              }}
            >
              <Icon size={18} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'tips' && (
        <div>
          {/* 今日Tip */}
          <div style={{ ...cardStyle, marginBottom: 20, background: 'linear-gradient(135deg, #007aff, #5856d6)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 32, marginRight: 12 }}>{todayTip.icon}</span>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>今日健康小贴士</h2>
                <p style={{ fontSize: 13, opacity: 0.9, margin: '4px 0 0 0' }}>{getTipCategoryName(todayTip.category)}</p>
              </div>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px 0' }}>{todayTip.title}</h3>
            <p style={{ fontSize: 14, opacity: 0.9, margin: 0, lineHeight: 1.6 }}>{todayTip.content}</p>
          </div>

          {/* 今日饮食Tip */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <Utensils size={20} color={colors.warning} style={{ marginRight: 8 }} />
              <span style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>今日饮食建议</span>
            </div>
            <p style={{ fontSize: 14, color: colors.textSecondary, margin: 0, lineHeight: 1.6 }}>{dietTip}</p>
          </div>

          {/* BMI信息 */}
          {profile && (
            <div style={{ ...cardStyle, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(0,122,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Target size={22} color={colors.primary} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>您的BMI</h3>
                    <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0 0' }}>身体质量指数</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 28, fontWeight: 700, color: bmiInfo.color, margin: 0 }}>{bmi.toFixed(1)}</p>
                  <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>{bmiInfo.category}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, height: 8, background: colors.success, borderRadius: 4 }}></div>
                <div style={{ flex: 1, height: 8, background: '#ffcc00', borderRadius: 4 }}></div>
                <div style={{ flex: 1, height: 8, background: colors.warning, borderRadius: 4 }}></div>
                <div style={{ flex: 1, height: 8, background: colors.danger, borderRadius: 4 }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: colors.textSecondary }}>
                <span>正常</span>
                <span>超重</span>
                <span>肥胖</span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'exercise' && prescription && (
        <div>
          {/* 运动处方卡片 */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Dumbbell size={24} color={colors.primary} style={{ marginRight: 12 }} />
              <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: 0 }}>您的个性化运动处方</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
              <div style={{ textAlign: 'center', padding: 16, background: colors.bgTertiary, borderRadius: 12 }}>
                <p style={{ fontSize: 24, fontWeight: 700, color: colors.primary, margin: 0 }}>{prescription.targetMinutes}</p>
                <p style={{ fontSize: 12, color: colors.textSecondary, margin: '4px 0 0 0' }}>每次目标(分钟)</p>
              </div>
              <div style={{ textAlign: 'center', padding: 16, background: colors.bgTertiary, borderRadius: 12 }}>
                <p style={{ fontSize: 24, fontWeight: 700, color: colors.success, margin: 0 }}>{prescription.weeklyTarget}</p>
                <p style={{ fontSize: 12, color: colors.textSecondary, margin: '4px 0 0 0' }}>每周目标(分钟)</p>
              </div>
              <div style={{ textAlign: 'center', padding: 16, background: colors.bgTertiary, borderRadius: 12 }}>
                <p style={{ fontSize: 24, fontWeight: 700, color: colors.warning, margin: 0 }}>{prescription.level === 'beginner' ? '初学者' : prescription.level === 'intermediate' ? '进阶' : '熟练'}</p>
                <p style={{ fontSize: 12, color: colors.textSecondary, margin: '4px 0 0 0' }}>运动级别</p>
              </div>
            </div>

            {/* 推荐运动 */}
            <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>推荐运动</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {prescription.recommendedExercises.map((ex, i) => (
                <div key={i} style={{ padding: 16, background: colors.bgTertiary, borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 24, marginRight: 12 }}>{ex.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: colors.text, margin: 0 }}>{ex.name}</p>
                      <p style={{ fontSize: 12, color: colors.textSecondary, margin: '2px 0 0 0' }}>{ex.duration} · {ex.frequency}</p>
                    </div>
                    <span style={{ padding: '4px 10px', background: ex.intensity === 'low' ? colors.badgeGreenBg : ex.intensity === 'moderate' ? colors.badgeOrangeBg : 'rgba(255,59,48,0.15)', color: ex.intensity === 'low' ? colors.success : ex.intensity === 'moderate' ? colors.warning : colors.danger, fontSize: 11, fontWeight: 600, borderRadius: 20 }}>
                      {ex.intensity === 'low' ? '低强度' : ex.intensity === 'moderate' ? '中等' : '高强度'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>{ex.description}</p>
                </div>
              ))}
            </div>

            {/* 警告 */}
            {prescription.warnings.length > 0 && (
              <div style={{ marginTop: 20, padding: 16, background: 'rgba(255,149,0,0.1)', borderRadius: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: colors.warning, margin: '0 0 12px 0' }}>⚠️ 注意事项</h4>
                {prescription.warnings.map((w, i) => (
                  <p key={i} style={{ fontSize: 13, color: colors.warning, margin: '0 0 6px 0' }}>• {w}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'diet' && (
        <div>
          {/* 今日饮食建议 */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>今日饮食建议</h2>
            <p style={{ fontSize: 14, color: colors.textSecondary, margin: 0, lineHeight: 1.6 }}>{dietTip}</p>
          </div>

          {/* 一周食谱 */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>本周食谱推荐</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {weeklyMealPlan.slice(0, 3).map((day, i) => (
                <div key={i} style={{ padding: 14, background: colors.bgTertiary, borderRadius: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: colors.primary, margin: '0 0 8px 0' }}>{day.day}</p>
                  <p style={{ fontSize: 12, color: colors.textSecondary, margin: '0 0 4px 0' }}>🌅 早餐: {day.breakfast}</p>
                  <p style={{ fontSize: 12, color: colors.textSecondary, margin: '0 0 4px 0' }}>☀️ 午餐: {day.lunch}</p>
                  <p style={{ fontSize: 12, color: colors.textSecondary, margin: 0 }}>🌙 晚餐: {day.dinner}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 食物推荐 */}
          <div style={{ ...cardStyle }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>食物红绿灯</h2>
            {foodRecommendations.map((cat, i) => (
              <div key={i} style={{ marginBottom: i < foodRecommendations.length - 1 ? 20 : 0 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: i === 0 ? colors.success : i === 1 ? colors.warning : colors.danger, margin: '0 0 12px 0' }}>{cat.category}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {cat.foods.map((food, j) => (
                    <div key={j} style={{ padding: '10px 14px', background: colors.bgTertiary, borderRadius: 10 }}>
                      <span style={{ marginRight: 6 }}>{food.icon}</span>
                      <span style={{ fontSize: 13, color: colors.text }}>{food.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div>
          {healthArticles.map((article) => (
            <div
              key={article.id}
              style={{ ...cardStyle, marginBottom: 16, cursor: 'pointer' }}
              onClick={() => setSelectedArticle(article)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 32, marginRight: 16 }}>{article.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: colors.primary, margin: '0 0 4px 0' }}>{getCategoryName(article.category)}</p>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: colors.text, margin: 0 }}>{article.title}</h3>
                  <p style={{ fontSize: 14, color: colors.textSecondary, margin: '8px 0 0 0' }}>{article.summary}</p>
                </div>
                <ChevronRight size={20} color={colors.textTertiary} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setSelectedArticle(null)}
        >
          <div
            style={{
              background: colors.cardBg,
              borderRadius: 20,
              maxWidth: 600,
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 24 }}>
              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: colors.bgTertiary,
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} color={colors.textSecondary} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 40, marginRight: 12 }}>{selectedArticle.icon}</span>
                <div>
                  <p style={{ fontSize: 12, color: colors.primary, margin: 0 }}>{getCategoryName(selectedArticle.category)}</p>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: '4px 0 0 0' }}>{selectedArticle.title}</h2>
                </div>
              </div>

              <div style={{ lineHeight: 1.8, color: colors.text, fontSize: 15 }}>
                {selectedArticle.content.split('\n').map((line, i) => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith('## ')) {
                    return <h3 key={i} style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginTop: 24, marginBottom: 12 }}>{trimmed.replace('## ', '')}</h3>;
                  }
                  if (trimmed.startsWith('### ')) {
                    return <h4 key={i} style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginTop: 20, marginBottom: 8 }}>{trimmed.replace('### ', '')}</h4>;
                  }
                  if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ') || trimmed.startsWith('5. ')) {
                    return <p key={i} style={{ marginLeft: 16, marginBottom: 8 }}>{trimmed}</p>;
                  }
                  if (trimmed.startsWith('- ')) {
                    return <p key={i} style={{ marginLeft: 16, marginBottom: 4, color: colors.textSecondary }}>{trimmed.replace('- ', '')}</p>;
                  }
                  if (trimmed.startsWith('|')) {
                    return null;
                  }
                  if (trimmed === '') {
                    return <br key={i} />;
                  }
                  // 处理加粗
                  const parts = trimmed.split(/(\*\*[^*]+\*\*)/);
                  return (
                    <p key={i} style={{ marginBottom: 8 }}>
                      {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'indicators' && (
        <div>
          {['liver', 'metabolic', 'body'].map(cat => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 12px 0', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: 8 }}>{getCategoryIcon(cat as any)}</span>
                {getIndicatorCategoryName(cat as any)}
              </h3>
              {healthIndicators.filter(ind => ind.category === cat).map(ind => (
                <div key={ind.id} style={{ ...cardStyle, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: colors.text, margin: 0 }}>{ind.name} <span style={{ fontSize: 12, color: colors.textSecondary }}>({ind.nameEn})</span></p>
                      <p style={{ fontSize: 12, color: colors.textSecondary, margin: '4px 0 0 0' }}>单位: {ind.unit}</p>
                    </div>
                    <span style={{ fontSize: 11, padding: '4px 10px', background: colors.badgeGreenBg, color: colors.badgeGreenText, borderRadius: 20 }}>正常: {ind.normal}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                    <div><span style={{ color: colors.success, fontWeight: 600 }}>正常</span>: {ind.normal}</div>
                    <div><span style={{ color: colors.warning, fontWeight: 600 }}>注意</span>: {ind.warning}</div>
                    <div><span style={{ color: colors.danger, fontWeight: 600 }}>危险</span>: {ind.danger}</div>
                  </div>
                  <p style={{ fontSize: 13, color: colors.textSecondary, margin: '12px 0 0 0', lineHeight: 1.5 }}>{ind.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
