import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, BarChart3, Bell, Settings, Heart, Trophy, BookOpen } from 'lucide-react';

const navItems = [
  { path: '/', label: '首页', icon: LayoutDashboard },
  { path: '/checkin', label: '打卡', icon: ClipboardCheck },
  { path: '/statistics', label: '数据', icon: BarChart3 },
  { path: '/education', label: '学院', icon: BookOpen },
  { path: '/reminders', label: '提醒', icon: Bell },
  { path: '/achievements', label: '成就', icon: Trophy },
  { path: '/settings', label: '设置', icon: Settings },
];

export function Layout() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f7' }}>
      <aside style={{ width: 240, background: 'white', borderRight: '1px solid #e5e5ea', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ff6b6b, #ffa500)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Heart size={18} color="white" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f' }}>健康</span>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 400,
                  color: isActive ? '#007aff' : '#86868b',
                  background: isActive ? 'rgba(0,122,255,0.1)' : 'transparent',
                  textDecoration: 'none',
                  marginBottom: 2,
                }}
              >
                <Icon size={20} style={{ marginRight: 12 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: 12, color: '#aeaeb2', textAlign: 'center' }}>坚持 · 改变</p>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: 240, padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}
