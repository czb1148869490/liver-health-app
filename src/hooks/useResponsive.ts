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
    background: 'var(--color-card-bg)',
    borderRadius: isMobile ? 14 : 18,
    boxShadow: 'var(--color-card-shadow)',
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

// 主题颜色 Hook - 使用 CSS 变量自动响应主题变化
export function useThemeColors() {
  // 使用 CSS 变量，无需手动检测主题变化
  return {
    // 文本颜色
    text: 'var(--color-text)',
    textSecondary: 'var(--color-text-secondary)',
    textTertiary: 'var(--color-text-tertiary)',
    textPlaceholder: 'var(--color-text-placeholder)',
    // 背景颜色
    bg: 'var(--color-bg)',
    bgSecondary: 'var(--color-bg-secondary)',
    bgTertiary: 'var(--color-bg-tertiary)',
    bgElevated: 'var(--color-bg-elevated)',
    // 边框颜色
    border: 'var(--color-border)',
    borderSecondary: 'var(--color-border-secondary)',
    // 品牌颜色
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    purple: 'var(--color-purple)',
    yellow: 'var(--color-yellow)',
    // 组件特定
    cardBg: 'var(--color-card-bg)',
    cardShadow: 'var(--color-card-shadow)',
    inputBg: 'var(--color-input-bg)',
    inputBorder: 'var(--color-input-border)',
    progressBg: 'var(--color-progress-bg)',
    // 徽章颜色
    badgeGreenBg: 'var(--color-badge-green-bg)',
    badgeGreenText: 'var(--color-badge-green-text)',
    badgeOrangeBg: 'var(--color-badge-orange-bg)',
    badgeOrangeText: 'var(--color-badge-orange-text)',
    badgeBlueBg: 'var(--color-badge-blue-bg)',
    badgeBlueText: 'var(--color-badge-blue-text)',
    // 图表颜色
    chartGrid: 'var(--color-chart-grid)',
    chartAxis: 'var(--color-chart-axis)',
  };
}
