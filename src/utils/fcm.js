import { firebaseConfig, VAPID_KEY  } from "@/config/firebase";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// 앱 시작 시 한 번 호출 (예: main.js 또는 App.vue의 onMounted)
export function listenForegroundMessages() {
  if (!('Notification' in window)) return;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  return onMessage(messaging, async (payload) => {
    console.log('포그라운드 메시지 수신:', payload);
    const { title, body, image } = payload.notification ?? {};
    if (!title) return;

    const registration = await navigator.serviceWorker.getRegistration(
      '/firebase-cloud-messaging-push-scope'
    );
    (registration ?? (await navigator.serviceWorker.ready)).showNotification(title, {
      body,
      image,
      icon: '/firebase-logo.png',
      data: payload.data,   // url 등
    });
  });
}



export async function getFcmToken() {
  const supported =
    'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  if (!supported) throw new Error('이 브라우저는 FCM을 지원하지 않습니다.');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('알림 권한이 거부되었습니다.');

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  return getToken(messaging, { vapidKey: VAPID_KEY });
}