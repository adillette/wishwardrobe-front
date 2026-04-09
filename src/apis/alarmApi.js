import axios from "axios";
import "./axiosConfig";
import { alarmApi } from "./axiosConfig";

/**
 * ✅ 공개키 조회
 */
async function getPublicKey() {
  const response = await alarmApi.get('/public-key');
  return response.data;
}

/**
 * ✅ 구독 정보 저장
 * @param {Object} subscription - 구독 정보
 */
async function subscribe(subscription) {
  const response = await alarmApi.post('/subscribe', subscription);
  return response.data;
}

/**
 * ✅ 알림 전송
 * @param {Object} request - { title, message, ... }
 */
async function sendNotification(request) {
  const response = await alarmApi.post('/send', request);
  return response.data;
}

/**
 * ✅ 토픽 알림 전송
 * @param {Object} request - { topic, title, message, ... }
 */
async function sendTopicNotification(request) {
  const response = await alarmApi.post('/send-topic', request);
  return response.data;
}

/**
 * ✅ 토큰 알림 전송
 * @param {Object} request - { token, title, message, ... }
 */
async function sendTokenNotification(request) {
  const response = await alarmApi.post('/send-token', request);
  return response.data;
}

/**
 * ✅ 브로드캐스트 알림 전송
 * @param {Object} request - { title, message, ... }
 */
async function broadcast(request) {
  const response = await alarmApi.post('/broadcast', request);
  return response.data;
}

export default {
  getPublicKey,
  subscribe,
  sendNotification,
  sendTopicNotification,
  sendTokenNotification,
  broadcast
};
