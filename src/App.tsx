import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { CheckIn } from './pages/CheckIn'
import { Statistics } from './pages/Statistics'
import { Reminders } from './pages/Reminders'
import { Achievements } from './pages/Achievements'
import { SettingsPage } from './pages/Settings'
import { Education } from './pages/Education'
import { useHealthStore } from './stores/healthStore'

function App() {
  const { checkReminders, theme } = useHealthStore();

  // 主题变化时更新
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // 检查提醒和定时器
  useEffect(() => {
    // 检查提醒（不主动请求权限，让用户主动开启）
    checkReminders();

    // 每分钟检查一次提醒
    const interval = setInterval(() => {
      checkReminders();
    }, 60000);

    // 组件卸载时清除定时器
    return () => clearInterval(interval);
  }, [checkReminders]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="education" element={<Education />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
