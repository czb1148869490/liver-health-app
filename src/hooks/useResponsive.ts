import { useState, useEffect } from 'react';

// 统一图标大小规范（基于 iOS HIG）
export const ICON_SIZES = {
  nav: { mobile: 22, desktop: 24 },
  primary: { mobile: 22, desktop: 24 },
  secondary: { mobile: 20, desktop: 22 },
  arrow: { mobile: 18, desktop: 20 },
  small: { mobile: 16, desktop: 18 },
  tiny: { mobile: 14, desktop: 16 },
};

export function useIconSize(type: keyof typeof ICON_SIZES) {
  const { isMobile } = useResponsive();
  return isMobile ? ICON_SIZES[type].mobile : ICON_SIZES[type].desktop;
}

// 响应式布局 hook
export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallMobile(width < 375);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return { isMobile, isSmallMobile };
}

// 响应式容器样式
export function useContainerStyle() {
  const { isMobile } = useResponsive();
  return {
    maxWidth: isMobile ? '100%' : 900,
    margin: isMobile ? '0' : '0 auto',
  };
}

// 响应式卡片样式
export function useCardStyle() {
  const { isMobile } = useResponsive();
  return {
    background: 'white',
    borderRadius: isMobile ? 14 : 18,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: isMobile ? 16 : 20,
  };
}

// 响应式网格
export function useGridStyle(columns: number, gap: number = 16) {
  const { isMobile } = useResponsive();
  return {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : `repeat(${columns}, 1fr)`,
    gap: isMobile ? gap / 2 : gap,
  };
}

// 响应式字体大小
export function useFontSize(desktop: number, mobile: number) {
  const { isMobile } = useResponsive();
  return isMobile ? mobile : desktop;
}
