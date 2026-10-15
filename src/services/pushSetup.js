import alarmApi from '@/apis/alarmApi';
import locationApi from '@/apis/locationApi';
import { getFcmToken } from '@/utils/fcm';
import { getCurrentUserId, getNotificationChannel, getDeviceId } from '@/constants/user';


const urlBase64ToUint8Array =(base64String) =>{
    const padding = '='.repeat((4-(base64String.length %4))%4);
     const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

async function subscribeWebPush(userId) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('이 브라우저는 푸시 알림을 지원하지 않습니다.');
  }

  const permission = await Notification.requestPermission();
  if(permission!== 'granted') throw new Error('알림 권한이 거부되었습니다.');
   const registration = await navigator.serviceWorker.register('/service-worker.js');
  await navigator.serviceWorker.ready;

  const vapidPublicKey = await alarmApi.getPublicKey();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  });

  await alarmApi.subscribe({ ...subscription.toJSON(), userId });
    
}


async function registerFcm(userId) {
  const token = await getFcmToken();
  await alarmApi.registerFcmToken({ userId, token, deviceId: getDeviceId() });
}

// 알림 켜기: 채널 등록 + (위치가 있으면) 위치 저장
export async function enableNotification(lat, lon) {
  const userId = getCurrentUserId();
  const channel = getNotificationChannel(userId);

  if (channel === 'FCM') await registerFcm(userId);
  else await subscribeWebPush(userId);

  let locationSaved = false;
  if (lat != null && lon != null) {
    try {
      await locationApi.updateLocation(userId, lat, lon, true);
      locationSaved = true;
    } catch (e) {
      console.error('알림 위치 저장 실패:', e);
    }
  }
  return { channel, locationSaved };
}