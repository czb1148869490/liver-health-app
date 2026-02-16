import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, User, Heart, Menu, X } from 'lucide-react';
import { useThemeColors } from '../../hooks/useResponsive';

const navItems = [
  { path: '/', label: '今日', icon: LayoutDashboard },
  { path: '/trend', label: '趋势', icon: BarChart3 },
  { path: '/profile', label: '我的', icon: User },
];

export function Layout() {
  const location = useLocation();
  const colors = useThemeColors();
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
      <div style={{ display: 'flex', minHeight: '100vh', background: colors.bgSecondary }}>
        <aside style={{
          width: 240,
          background: colors.cardBg,
          borderRight: `1px solid ${colors.border}`,
          position: 'fixed',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100
        }}>
          <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: `1px solid ${colors.border}` }}>
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
            <span style={{ fontSize: 17, fontWeight: 600, color: colors.text }}>健康</span>
          </div>

          <nav style={{ flex: 1, padding: '12px 10px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="touch-target"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 400,
                    color: isActive ? colors.primary : colors.textSecondary,
                    background: isActive ? 'rgba(0,122,255,0.1)' : 'transparent',
                    textDecoration: 'none',
                    marginBottom: 2,
                    minHeight: 44,
                  }}
                >
                  <Icon size={20} style={{ marginRight: 12 }} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ padding: 16, borderTop: `1px solid ${colors.border}` }}>
            <p style={{ fontSize: 12, color: colors.textTertiary, textAlign: 'center' }}>坚持 · 改变</p>
          </div>
        </aside>

        <main style={{ flex: 1, marginLeft: 240, padding: 32, background: colors.bg }}>
          {/* eslint-disable-next-line */}
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
      background: colors.bgSecondary,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {/* Mobile Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 99,
        background: colors.cardBg,
        borderBottom: `1px solid ${colors.border}`,
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
          <span style={{ fontSize: 17, fontWeight: 600, color: colors.text }}>健康</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="touch-target"
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer'
          }}
        >
          <Menu size={24} color={colors.text} />
        </button>
      </header>

      {/* Mobile Content */}
      <main style={{
        flex: 1,
        padding: 16,
        paddingBottom: 'calc(60px + env(safe-area-inset-bottom))',
        overflow: 'auto',
        background: colors.bg
      }}>
        {/* eslint-disable-next-line */}
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.cardBg,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: 6,
        zIndex: 100,
        height: 'calc(56px + env(safe-area-inset-bottom))'
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
                color={isActive ? colors.primary : colors.textSecondary}
                style={{ marginBottom: 2 }}
              />
              <span style={{
                fontSize: 10,
                color: isActive ? colors.primary : colors.textSecondary,
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
              background: colors.cardBg,
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
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: colors.text }}>菜单</span>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}
              >
                <X size={24} color={colors.textSecondary} />
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
                      color: isActive ? colors.primary : colors.text,
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

// Need to import Outlet
import { Outlet } from 'react-router-dom';
