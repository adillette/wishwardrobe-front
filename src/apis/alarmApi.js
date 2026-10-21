import axios from "axios";
import "./axiosConfig";
import { alarmApi } from "./axiosConfig";

// 공개키 조회
 
async function getPublicKey() {
  const response = await alarmApi.get('/public-key');
  return response.data;
}

// 구독 정보 저장
async function subscribe(subscription) {
  const response = await alarmApi.post('/subscribe', subscription);
  return response.data;
}
//웹푸시 구독 해제 로그아웃, 채널 변경시
async function unsubscribe({endpoint}) {
  const response = await alarmApi.post('/unsubscribe', {endpoint});
  return response.data;
}


// 토픽 알림 전송
 
async function sendTopicNotification(request) {
  const response = await alarmApi.post('/send-topic', request);
  return response.data;
}


  // 토큰 알림 전송
 
async function sendTokenNotification(request) {
  const response = await alarmApi.post('/send-token', request);
  return response.data;
}

// 브로드캐스트 알림 전송
 
async function broadcast(request) {
  const response = await alarmApi.post('/broadcast', request);
  return response.data;
}


//FCM 토큰 등록
async function registerFcmToken({userId, token,deviceId}) {
  const response = await alarmApi.post('/fcm/register',{userId,token,deviceId});
  return response.data;
}



//FCM 토큰 해제 *로그아웃, 채널 변경
async function unregisterFcmToken({token}) {
  const response = await alarmApi.post('/fcm/unregister',{token});
  return response.data;
}

async function savePreference({userId, channel}) {
  const response = await alarmApi.put('/preference',{userId, channel});
  return response.data
}

async function getPreference(userId) {
  const response = await alarmApi.get(`/preference/${userId}`);
  return response.data;
}

export default {
  getPublicKey,
  subscribe,
  sendTopicNotification,
  sendTokenNotification,
  broadcast,
  registerFcmToken,
  unregisterFcmToken,
  unsubscribe,
  savePreference,
  getPreference
};
