import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, BarChart3, Bell, Settings, Heart, Trophy, BookOpen, Menu, X } from 'lucide-react';

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
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Desktop Layout
  if (!isMobile) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f7' }}>
        <aside style={{
          width: 240,
          background: 'white',
          borderRight: '1px solid #e5e5ea',
          position: 'fixed',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100
        }}>
          <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}>
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

  // Mobile Layout with Bottom Tab Bar
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#f5f5f7',
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {/* Mobile Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 99,
        background: 'white',
        borderBottom: '1px solid #e5e5ea',
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 16,
        paddingRight: 16,
        height: 'calc(44px + env(safe-area-inset-top))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10
          }}>
            <Heart size={18} color="white" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f' }}>健康</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer'
          }}
        >
          <Menu size={24} color="#1d1d1f" />
        </button>
      </header>

      {/* Mobile Content */}
      <main style={{
        flex: 1,
        padding: 16,
        paddingBottom: 'calc(60px + env(safe-area-inset-bottom))',
        overflow: 'auto'
      }}>
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #e5e5ea',
        display: 'flex',
        justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: 6,
        zIndex: 100,
        height: 'calc(50px + env(safe-area-inset-bottom))'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 8px',
                textDecoration: 'none',
                minWidth: 44
              }}
            >
              <Icon
                size={22}
                color={isActive ? '#007aff' : '#8e8e93'}
                style={{ marginBottom: 2 }}
              />
              <span style={{
                fontSize: 10,
                color: isActive ? '#007aff' : '#8e8e93',
                fontWeight: isActive ? 500 : 400
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 200,
          }}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 280,
              background: 'white',
              paddingTop: 'env(safe-area-inset-top)',
              animation: 'slideIn 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid #e5e5ea'
            }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f' }}>菜单</span>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}
              >
                <X size={24} color="#8e8e93" />
              </button>
            </div>

            <nav style={{ padding: '12px 10px' }}>
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
                      padding: '12px 14px',
                      borderRadius: 10,
                      fontSize: 16,
                      fontWeight: 400,
                      color: isActive ? '#007aff' : '#1d1d1f',
                      background: isActive ? 'rgba(0,122,255,0.1)' : 'transparent',
                      textDecoration: 'none',
                      marginBottom: 4,
                    }}
                  >
                    <Icon size={22} style={{ marginRight: 14 }} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
