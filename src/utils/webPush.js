import axios from "axios";

const VAPID_PUBLIC_KEY='';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

async function subscribeToWebPush(){
  const registration = await navigator.serviceWorker.register('/service-worker.js');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });

  await axios.post('/api/push/subscribe',subscription);

  return subscription;
}



export default{
  subscribeToWebPush
}