import alarmApi from '@/apis/alarmApi';
import locationApi from '@/apis/locationApi';
import { getFcmToken } from '@/utils/fcm';
import { getCurrentUserId, setNotificationChannel, getDeviceId } from '@/constants/user';

// VAPID 키를 Base64 URL-safe 문자열에서 Uint8Array로 변환
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
};

// 웹푸시 등록
async function subscribeWebPush(userId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('이 브라우저는 푸시 알림을 지원하지 않습니다.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('알림 권한이 거부되었습니다.');

  const registration = await navigator.serviceWorker.register('/service-worker.js');
  await navigator.serviceWorker.ready;

  const vapidPublicKey = await alarmApi.getPublicKey();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  await alarmApi.subscribe({ ...subscription.toJSON(), userId });
  localStorage.setItem('pushEndpoint', subscription.endpoint); // 해제할 때 필요
}

// FCM 토큰 등록
async function registerFcm(userId) {
  const token = await getFcmToken();
  await alarmApi.registerFcmToken({ userId, token, deviceId: getDeviceId() });
  localStorage.setItem('fcmToken', token); // 해제할 때 필요
}

// 이 브라우저에 이미 등록된 반대 채널 해제 (같은 기기에 알림이 2번 가는 것 방지)
async function clearOtherChannel(channel) {
  const endpoint = localStorage.getItem('pushEndpoint');
  const token = localStorage.getItem('fcmToken');

  if (channel === 'FCM' && endpoint) {
    try {
      await alarmApi.unsubscribe({ endpoint });
      localStorage.removeItem('pushEndpoint'); // 성공했을 때만 지움
    } catch (e) {
      console.error('이전 채널 해제 실패:', e);
    }
  }
  if (channel === 'WEBPUSH' && token) {
    try {
      await alarmApi.unregisterFcmToken({ token });
      localStorage.removeItem('fcmToken');
    } catch (e) {
      console.error('이전 채널 해제 실패:', e);
    }
  }
}
// 알림 켜기: 반대 채널 해제 -> 선택한 채널 등록 -> (위치가 있으면) 위치 저장
export async function enableNotification(channel, lat, lon) {
  const userId = getCurrentUserId();
  if (userId == null) throw new Error('로그인이 필요합니다.');
  if (channel !== 'FCM' && channel !== 'WEBPUSH') throw new Error(`알 수 없는 채널: ${channel}`);
  
  if (channel === 'FCM') await registerFcm(userId);
  else await subscribeWebPush(userId);
  
  await clearOtherChannel(channel);
  setNotificationChannel(channel);

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