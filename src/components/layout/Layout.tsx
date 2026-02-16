import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, User, Heart } from 'lucide-react';
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
            <span style={{ fontSize: 17, fontWeight: 600, color: colors.text }}>脂肪肝健康</span>
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
        justifyContent: 'center'
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
          <span style={{ fontSize: 17, fontWeight: 600, color: colors.text }}>脂肪肝健康</span>
        </div>
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
    </div>
  );
}

// Need to import Outlet
import { Outlet } from 'react-router-dom';
