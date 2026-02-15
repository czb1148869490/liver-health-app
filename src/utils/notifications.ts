// 浏览器通知工具模块

export interface NotificationPermissionResult {
  status: NotificationPermission;
  canRequest: boolean;
}

// 请求通知权限
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('此浏览器不支持通知功能');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

// 检查当前通知权限状态
export const checkNotificationPermission = (): NotificationPermission => {
  if (!('Notification' in window)) {
    return { status: 'denied', canRequest: false };
  }

  return {
    status: Notification.permission,
    canRequest: Notification.permission === 'default',
  };
};

// 发送通知
export const sendNotification = (title: string, options?: NotificationOptions): void => {
  if (!('Notification' in window)) {
    console.warn('此浏览器不支持通知功能');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });

    // 5秒后自动关闭
    setTimeout(() => {
      notification.close();
    }, 5000);
  }
};

// 安排定时通知
export const scheduleNotification = (
  id: string,
  title: string,
  time: string, // HH:mm 格式
  options?: NotificationOptions
): (() => void) => {
  const checkAndNotify = () => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);

    if (now.getHours() === hours && now.getMinutes() === minutes) {
      sendNotification(title, options);
    }
  };

  // 每分钟检查一次
  const intervalId = setInterval(checkAndNotify, 60000);

  // 返回清理函数
  return () => {
    clearInterval(intervalId);
  };
};

// 常见提醒类型
export const ReminderNotifications = {
  exercise: (duration: number) =>
    sendNotification('运动时间到！', {
      body: `是时候运动${duration}分钟了，坚持就是胜利！`,
      tag: 'exercise-reminder',
    }),

  breakfast: () =>
    sendNotification('早餐时间', {
      body: '记得吃早餐，开启健康的一天！',
      tag: 'meal-reminder',
    }),

  lunch: () =>
    sendNotification('午餐时间', {
      body: '该吃午餐了，保持营养均衡！',
      tag: 'meal-reminder',
    }),

  dinner: () =>
    sendNotification('晚餐时间', {
      body: '晚餐时间到了，注意控制热量摄入！',
      tag: 'meal-reminder',
    }),

  weight: () =>
    sendNotification('体重记录提醒', {
      body: '记得记录今天的体重变化哦！',
      tag: 'weight-reminder',
    }),

  checkup: (checkupType: string) =>
    sendNotification('检查提醒', {
      body: `该进行${checkupType}检查了，关注身体健康！`,
      tag: 'checkup-reminder',
    }),

  achievement: (achievementName: string, points: number) =>
    sendNotification('🎉 成就解锁！', {
      body: `恭喜获得"${achievementName}"成就，+${points}积分`,
      tag: 'achievement',
    }),
};
