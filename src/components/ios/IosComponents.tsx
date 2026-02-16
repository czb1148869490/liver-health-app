import React, { useState, useEffect, ReactNode } from 'react';
import { Check, X, Loader2 } from 'lucide-react';

// iOS Card Component - 统一卡片样式
interface IosCardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export function IosCard({ children, style, className = '', onClick }: IosCardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        border: '1px solid var(--color-border)',
        boxShadow: 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// iOS List Component - 列表项样式
interface IosListItemProps {
  children: ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function IosListItem({ children, onClick, style }: IosListItemProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--color-border)',
        minHeight: 44,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function IosList({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

// iOS Circular Progress Component - 环形进度
interface IosProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
}

export function IosProgress({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = '#007aff',
  showLabel = true,
  label
}: IosProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-progress-bg)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {showLabel && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: size * 0.25, fontWeight: 700, color: 'var(--color-text)' }}>
            {percentage}%
          </div>
          {label && (
            <div style={{ fontSize: size * 0.1, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// iOS Toast Component
interface IosToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function IosToast({ message, type = 'success', duration = 2000, onClose }: IosToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`ios-toast ${type}`}>
      {type === 'success' && <Check size={18} style={{ marginRight: 8 }} />}
      {type === 'error' && <X size={18} style={{ marginRight: 8 }} />}
      {message}
    </div>
  );
}

// iOS Confirm Dialog Component
interface IosConfirmProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function IosConfirm({
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  danger = false
}: IosConfirmProps) {
  return (
    <div className="ios-overlay" onClick={onCancel}>
      <div className="ios-dialog" onClick={e => e.stopPropagation()}>
        <div className="ios-dialog-title">{title}</div>
        <div className="ios-dialog-message">{message}</div>
        <div className="ios-dialog-actions">
          <button className="ios-dialog-btn cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`ios-dialog-btn ${danger ? 'danger' : 'primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// iOS Button with Loading State
interface IosButtonProps {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: React.CSSProperties;
  className?: string;
}

export function IosButton({
  children,
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  className = ''
}: IosButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 24px',
    borderRadius: 14,
    fontWeight: 500,
    fontSize: 17,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s',
    ...style
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { background: '#007aff', color: 'white' },
    secondary: { background: '#f2f2f7', color: '#007aff' },
    danger: { background: '#ff3b30', color: 'white' }
  };

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...baseStyle, ...variantStyles[variant] }}
    >
      {loading && <Loader2 size={18} className="animate-spin" style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />}
      {children}
    </button>
  );
}

// Mood Button with 44px touch target
interface MoodButtonProps {
  emoji: string;
  isSelected: boolean;
  onClick: () => void;
  size?: number;
}

export function MoodButton({ emoji, isSelected, onClick, size = 44 }: MoodButtonProps) {
  return (
    <button
      onClick={onClick}
      className="touch-target"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: isSelected ? '#007aff' : 'var(--color-bg-tertiary)',
        border: 'none',
        fontSize: size * 0.5,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        opacity: isSelected ? 1 : 0.5
      }}
    >
      {emoji}
    </button>
  );
}

// Skeleton Loading Component
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

// Loading Overlay
interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = '加载中...' }: LoadingOverlayProps) {
  return (
    <div className="ios-overlay">
      <div className="ios-dialog" style={{ textAlign: 'center' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#007aff', marginBottom: 16, animation: 'spin 1s linear infinite' }} />
        <div style={{ fontSize: 15, color: 'var(--color-text-secondary)' }}>{message}</div>
      </div>
    </div>
  );
}

// Helper hook for managing toast state
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return { toast, showToast, hideToast };
}

// Helper hook for managing confirm dialog state
export function useConfirm() {
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    danger: boolean;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    danger: false
  });

  const confirm = (title: string, message: string, danger = false): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        title,
        message,
        danger,
        onConfirm: () => {
          resolve(true);
          setConfirmState(prev => ({ ...prev, open: false }));
        }
      });
    });
  };

  const closeConfirm = () => {
    setConfirmState(prev => ({ ...prev, open: false }));
  };

  return { confirmState, confirm, closeConfirm };
}
