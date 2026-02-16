import { useState, useEffect } from 'react';
import { useHealthStore } from '../stores/healthStore';
import { User, Target, Download, Trash2, Heart, Info, Check, Moon, Sun, Monitor, FileText } from 'lucide-react';
import { generateMedicalReport } from '../utils/pdfExport';
import { useResponsive, useCardStyle, useThemeColors } from '../hooks/useResponsive';
import { IosConfirm, IosToast } from '../components/ios/IosComponents';
import { impactLight, success, error } from '../utils/haptics';

export function SettingsPage() {
  const { profile, updateProfile, theme } = useHealthStore();
  const { isMobile } = useResponsive();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState('profile');

  if (!profile) return <div style={{ padding: 40, textAlign: 'center', color: colors.textSecondary }}>请先在首页完成个人资料设置</div>;

  return (
    <div style={{ maxWidth: isMobile ? '100%' : 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 700, color: colors.text, marginBottom: isMobile ? 16 : 24 }}>设置</h1>
      <div style={{ display: 'flex', gap: 24, flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Sidebar */}
        <div style={{ width: isMobile ? '100%' : 200, flexShrink: 0 }}>
          <nav style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 4, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                background: activeTab === 'profile' ? 'rgba(0,122,255,0.1)' : 'transparent',
                color: activeTab === 'profile' ? colors.primary : colors.textSecondary,
                flex: isMobile ? '1' : 'none',
                minWidth: isMobile ? 'auto' : 180,
              }}
            >
              <User size={18} style={{ marginRight: 10 }} /> 个人资料
            </button>
            <button
              onClick={() => setActiveTab('target')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                background: activeTab === 'target' ? 'rgba(0,122,255,0.1)' : 'transparent',
                color: activeTab === 'target' ? colors.primary : colors.textSecondary,
                flex: isMobile ? '1' : 'none',
                minWidth: isMobile ? 'auto' : 180,
              }}
            >
              <Target size={18} style={{ marginRight: 10 }} /> 目标设置
            </button>
            <button
              onClick={() => setActiveTab('data')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                background: activeTab === 'data' ? 'rgba(0,122,255,0.1)' : 'transparent',
                color: activeTab === 'data' ? colors.primary : colors.textSecondary,
                flex: isMobile ? '1' : 'none',
                minWidth: isMobile ? 'auto' : 180,
              }}
            >
              <Download size={18} style={{ marginRight: 10 }} /> 数据管理
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                background: activeTab === 'appearance' ? 'rgba(0,122,255,0.1)' : 'transparent',
                color: activeTab === 'appearance' ? colors.primary : colors.textSecondary,
                flex: isMobile ? '1' : 'none',
                minWidth: isMobile ? 'auto' : 180,
              }}
            >
              {theme === 'dark' ? <Moon size={18} style={{ marginRight: 10 }} /> : <Sun size={18} style={{ marginRight: 10 }} />} 外观
            </button>
          </nav>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'profile' && <ProfileSettings profile={profile} updateProfile={updateProfile} colors={colors} />}
          {activeTab === 'target' && <TargetSettings profile={profile} updateProfile={updateProfile} colors={colors} />}
          {activeTab === 'data' && <DataSettings colors={colors} />}
          {activeTab === 'appearance' && <AppearanceSettings colors={colors} />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ profile, updateProfile, colors }: {
  profile: NonNullable<ReturnType<typeof useHealthStore.getState>['profile']>;
  updateProfile: (updates: Partial<typeof profile>) => void;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const cardStyle = useCardStyle();
  const [name, setName] = useState(profile.name);
  const [height, setHeight] = useState(profile.height.toString());
  const [currentWeight, setCurrentWeight] = useState(profile.currentWeight?.toString() || '');
  const [saved, setSaved] = useState(false);

  // 同步外部profile变化到组件状态
  useEffect(() => {
    setName(profile.name);
    setHeight(profile.height.toString());
    setCurrentWeight(profile.currentWeight?.toString() || '');
  }, [profile]);

  const handleSave = () => {
    updateProfile({ name, height: parseFloat(height) || profile.height, currentWeight: parseFloat(currentWeight) || profile.currentWeight });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 20 }}>个人资料</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>姓名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              className="input"
              placeholder="请输入你的名字"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>身高 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onBlur={handleSave}
              className="input"
              placeholder="170"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>当前体重 (kg)</label>
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              onBlur={handleSave}
              step="0.1"
              className="input"
              placeholder="75"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>脂肪肝程度</label>
            <select
              value={profile.fattyLiverLevel}
              onChange={(e) => updateProfile({ fattyLiverLevel: e.target.value as typeof profile.fattyLiverLevel })}
              className="input"
            >
              <option value="mild">轻度</option>
              <option value="moderate">中度</option>
              <option value="severe">重度</option>
            </select>
          </div>
        </div>
        {saved && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', color: colors.success, fontSize: 14 }}>
            <Check size={16} style={{ marginRight: 6 }} /> 保存成功
          </div>
        )}
      </div>

      {/* Health Info */}
      <div style={{ padding: 20, background: 'rgba(0,122,255,0.08)', borderRadius: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Info size={20} color={colors.primary} style={{ marginRight: 12, marginTop: 2 }} />
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: colors.primary, margin: '0 0 8px 0' }}>健康信息</h4>
            <ul style={{ fontSize: 14, color: colors.primary, margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
              <li>初始体重: {profile.initialWeight} kg</li>
              {profile.currentWeight && profile.initialWeight && (
                <li>已减重: {(((profile.initialWeight - profile.currentWeight) / profile.initialWeight) * 100).toFixed(1)}% ({(profile.initialWeight - profile.currentWeight).toFixed(1)} kg)</li>
              )}
              <li>目标体重: {profile.targetWeight} kg</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TargetSettings({ profile, updateProfile, colors }: {
  profile: NonNullable<ReturnType<typeof useHealthStore.getState>['profile']>;
  updateProfile: (updates: Partial<typeof profile>) => void;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const cardStyle = useCardStyle();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 20 }}>目标设置</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>目标体重 (kg)</label>
            <input
              type="number"
              defaultValue={profile.targetWeight}
              onBlur={(e) => { updateProfile({ targetWeight: parseFloat(e.target.value) || profile.targetWeight }); handleSave(); }}
              step="0.1"
              className="input"
              placeholder="65"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>每日运动目标 (分钟)</label>
            <select
              defaultValue={profile.targetExerciseMinutes}
              onChange={(e) => { updateProfile({ targetExerciseMinutes: parseInt(e.target.value) }); handleSave(); }}
              className="input"
            >
              <option value="10">10 分钟 (初学者)</option>
              <option value="20">20 分钟</option>
              <option value="30">30 分钟 (推荐)</option>
              <option value="45">45 分钟</option>
              <option value="60">60 分钟</option>
              <option value="90">90 分钟</option>
            </select>
          </div>
        </div>
        {saved && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', color: colors.success, fontSize: 14 }}>
            <Check size={16} style={{ marginRight: 6 }} /> 保存成功
          </div>
        )}
      </div>

      <div style={{ padding: 20, background: 'rgba(52,199,89,0.08)', borderRadius: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Heart size={20} color={colors.success} style={{ marginRight: 12, marginTop: 2 }} />
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: colors.success, margin: '0 0 8px 0' }}>医学建议</h4>
            <ul style={{ fontSize: 14, color: colors.success, margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
              <li>每周运动 150-300 分钟可改善脂肪肝</li>
              <li>减重 5-10% 可显著改善病情</li>
              <li>建议配合地中海饮食</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataSettings({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const { profile, records, checkups, exerciseLogs, weightLogs, currentStreak } = useHealthStore();
  const cardStyle = useCardStyle();
  const [importFile, setImportFile] = useState<File | null>(null);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    type: 'import' | 'clear' | null;
  }>({ open: false, type: null });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleExportPDF = () => {
    if (!profile) return;
    generateMedicalReport({
      profile,
      records,
      checkups,
      exerciseLogs,
      weightLogs,
      currentStreak,
    });
    success();
    setToast({ message: 'PDF导出成功', type: 'success' });
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setConfirmState({ open: true, type: 'import' });
    event.target.value = '';
  };

  const executeImport = () => {
    if (!importFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed.state) {
          throw new Error('无效的数据格式');
        }
        localStorage.setItem('health-storage', JSON.stringify({ state: parsed.state, version: 1 }));
        setToast({ message: '数据导入成功，页面将重新加载', type: 'success' });
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        error();
        setToast({ message: '导入失败：无效的数据文件', type: 'error' });
        setTimeout(() => setToast(null), 2000);
      }
    };
    reader.readAsText(importFile);
    setConfirmState({ open: false, type: null });
    setImportFile(null);
  };

  const handleClear = () => {
    setConfirmState({ open: true, type: 'clear' });
  };

  const executeClear = () => {
    localStorage.removeItem('health-storage');
    setConfirmState({ open: false, type: null });
    setToast({ message: '数据已清除，页面将重新加载', type: 'success' });
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 20 }}>数据管理</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 导出数据 */}
          <div style={{ padding: 20, border: `1px solid ${colors.border}`, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>导出数据</h3>
                <p style={{ fontSize: 14, color: colors.textSecondary, margin: '4px 0 0 0' }}>下载所有健康数据到本地</p>
              </div>
              <button
                onClick={handleExport}
                style={{
                  padding: '10px 20px',
                  background: colors.primary,
                  color: 'white',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                导出
              </button>
            </div>
          </div>

          {/* 导出医生报告 */}
          <div style={{ padding: 20, border: `1px solid ${colors.border}`, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>医生报告</h3>
                <p style={{ fontSize: 14, color: colors.textSecondary, margin: '4px 0 0 0' }}>生成PDF报告，方便就医时使用</p>
              </div>
              <button
                onClick={handleExportPDF}
                disabled={!profile}
                style={{
                  padding: '10px 20px',
                  background: profile ? colors.success : colors.textTertiary,
                  color: 'white',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  border: 'none',
                  cursor: profile ? 'pointer' : 'not-allowed',
                }}
              >
                <FileText size={16} style={{ marginRight: 6 }} /> 导出PDF
              </button>
            </div>
          </div>

          {/* 导入数据 */}
          <div style={{ padding: 20, border: `1px solid ${colors.border}`, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>导入数据</h3>
                <p style={{ fontSize: 14, color: colors.textSecondary, margin: '4px 0 0 0' }}>从备份文件恢复数据</p>
              </div>
              <label
                htmlFor="import-file"
                style={{
                  padding: '10px 20px',
                  background: colors.success,
                  color: 'white',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                导入
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* 清除数据 */}
          <div style={{ padding: 20, border: '1px solid #ffccc7', borderRadius: 14, background: 'rgba(255,59,48,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.danger, margin: 0 }}>清除数据</h3>
                <p style={{ fontSize: 14, color: '#ff6b6b', margin: '4px 0 0 0' }}>删除所有本地存储的数据</p>
              </div>
              <button
                onClick={handleClear}
                style={{
                  padding: '10px 20px',
                  background: colors.danger,
                  color: 'white',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Trash2 size={16} style={{ marginRight: 6 }} /> 清除
              </button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20, padding: 16, background: colors.bgTertiary, borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>数据存储在您的浏览器本地存储中，不会上传到任何服务器。</p>
        </div>
      </div>

      {/* iOS Confirm Dialogs */}
      {confirmState.open && confirmState.type === 'import' && (
        <IosConfirm
          title="导入数据"
          message="导入数据将覆盖当前所有数据，确定要继续吗？"
          confirmText="确定导入"
          cancelText="取消"
          onConfirm={executeImport}
          onCancel={() => setConfirmState({ open: false, type: null })}
          danger
        />
      )}

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

      {/* iOS Toast */}
      {toast && (
        <IosToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

function AppearanceSettings({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const { theme, setTheme } = useHealthStore();
  const cardStyle = useCardStyle();

  const themeOptions = [
    { value: 'light', label: '浅色', icon: <Sun size={20} />, description: '使用浅色主题' },
    { value: 'dark', label: '深色', icon: <Moon size={20} />, description: '使用深色主题' },
    { value: 'system', label: '跟随系统', icon: <Monitor size={20} />, description: '根据设备设置自动切换' },
  ] as const;

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 20 }}>外观设置</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                impactLight();
                setTheme(option.value);
              }}
              className="touch-target"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 16,
                borderRadius: 14,
                border: theme === option.value ? `2px solid ${colors.primary}` : `2px solid ${colors.border}`,
                background: theme === option.value ? 'rgba(0,122,255,0.08)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                minHeight: 44,
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: theme === option.value ? colors.primary : colors.bgTertiary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
                color: theme === option.value ? 'white' : colors.textSecondary,
              }}>
                {option.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{option.label}</div>
                <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{option.description}</div>
              </div>
              {theme === option.value && (
                <Check size={20} color={colors.primary} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
