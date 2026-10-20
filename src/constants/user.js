// //사용자 번호로 알림 방식 임시 결정
// const CHANNEL_BY_DEV_USER = {1:'WEBPUSH' ,2: 'FCM'};

//userStore에서 로그인 정보 가져다 쓴다
import store from "@/store";



const CHANNEL_KEY="notificationChannel";
const DEVICE_KEY="deviceId";

//사용자 ID는 스토어에서 뽑아옴
export function getCurrentUserId(){
   return store.getters["user/userInfo"]?.userId ?? null;
}
// channel은 이 브라우저에서 사용자가 고른 값 디폴트 webpush
export const getNotificationChannel= () => localStorage.getItem(CHANNEL_KEY) ?? "WEBPUSH";
export const setNotificationChannel =(channel) => localStorage.setItem(CHANNEL_KEY,channel);


//현재 브라우저/기기를 구분하기 위한 임시 ID 생성
export function getDeviceId(){
    let id= localStorage.getItem(DEVICE_KEY);

    if(!id){
        id=crypto.randomUUID();
        localStorage.setItem(DEVICE_KEY,id);
    }
    return id;
}

