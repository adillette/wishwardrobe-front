//vue앱 페이지에 import로 번들에 포함 firebase 설정+vapid 키
//vapid 키: 토큰 만들때(구독 생성할때 사용하는 키)
//페이지에 initializeApp 이 필요하다.

export const firebaseConfig = {
 apiKey: "AIzaSyB4zfupHNoGbDuCfDGbCz__aiFFEvQNhkM",
  projectId: "today-wardrobe",
   messagingSenderId: "243188962870",
  appId: "1:243188962870:web:7930cc6d88872038b5ea97",
};

export const VAPID_KEY =  'BP4LfGdxmHwrq-rKtbXnIhtX89V68HGH1BM96mlWWdimEj5M7_ow5gZ6zkbulDJaTdb7lzyCpi35RJJwVl819gI';