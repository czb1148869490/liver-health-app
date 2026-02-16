import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Today } from './pages/Today'
import { Trend } from './pages/Trend'
import { Profile } from './pages/Profile'
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
          <Route index element={<Today />} />
          <Route path="trend" element={<Trend />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
