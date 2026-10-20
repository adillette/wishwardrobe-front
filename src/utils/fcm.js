import { firebaseConfig, VAPID_KEY  } from "@/config/firebase";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';


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