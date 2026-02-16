/**
 * iOS Haptic Feedback Utilities
 * Provides tactile feedback for user interactions
 */

// Check if device supports vibration
const supportsHaptics = () => {
  return 'vibrate' in navigator;
};

/**
 * Light impact - for UI selections, toggles
 */
export function impactLight() {
  if (supportsHaptics()) {
    navigator.vibrate(10);
  }
}

/**
 * Medium impact - for button presses
 */
export function impactMedium() {
  if (supportsHaptics()) {
    navigator.vibrate(20);
  }
}

/**
 * Heavy impact - for important actions
 */
export function impactHeavy() {
  if (supportsHaptics()) {
    navigator.vibrate(30);
  }
}

/**
 * Selection changed - for picker/selection scrolling
 */
export function selectionChanged() {
  if (supportsHaptics()) {
    navigator.vibrate(5);
  }
}

/**
 * Success notification pattern
 */
export function notificationSuccess() {
  if (supportsHaptics()) {
    navigator.vibrate([50, 30, 50]);
  }
}

/**
 * Warning notification pattern
 */
export function notificationWarning() {
  if (supportsHaptics()) {
    navigator.vibrate([30, 50, 30]);
  }
}

/**
 * Error notification pattern
 */
export function notificationError() {
  if (supportsHaptics()) {
    navigator.vibrate([50, 50, 50]);
  }
}

/**
 * Generic click feedback
 */
export function click() {
  impactLight();
}

/**
 * Button press feedback
 */
export function buttonPress() {
  impactMedium();
}

/**
 * Success feedback
 */
export function success() {
  notificationSuccess();
}

/**
 * Error feedback
 */
export function error() {
  notificationError();
}
