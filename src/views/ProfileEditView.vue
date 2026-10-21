<template>
  <div class="signup-page">
    <div class="signup-container">
      <h2>내 정보 수정</h2>

      <form @submit.prevent="handleUpdate">
        <div class="form-section basic-info">
          <div class="input-group">
            <label>이름</label>
            <input v-model="userName" type="text" placeholder="이름을 입력하세요" />
          </div>

          <div class="input-group">
            <label>아이디</label>
            <input :value="userInfo?.loginId" type="text" disabled />
          </div>

          <div class="input-group">
            <label>비밀번호</label>
            <div class="password-box">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="새 비밀번호를 입력하세요" />
              <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'" class="toggle-icon"
                @click="showPassword = !showPassword"></i>
            </div>
          </div>

          <div class="input-group">
            <label>이메일</label>
            <input v-model="userEmail" type="email" placeholder="이메일을 입력하세요" />
          </div>
          <div class="input-group">
            <label>주소</label>
            <input v-model="address" type="text" placeholder="주소를 입력하세요" />
          </div>
          <div class="input-group">
            <label>핸드폰 번호</label>
            <input v-model="phone" type="text" placeholder="핸드폰 번호를 입력하세요" />
          </div>
          <div class="input-group">
            <label>알림 방식</label>
            <div class="channel-box">
              <label><input v-model="channel" type="radio" value="WEBPUSH" /> 웹푸시</label>
              <label><input v-model="channel" type="radio" value="FCM" /> FCM</label>
            </div>
          </div>
        </div>

        <button type="submit" class="btn-submit" :disabled="!isFormComplete">
          수정 완료
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import memberApi from "@/apis/memberApi";
import { getNotificationChannel, setNotificationChannel } from "@/constants/user";
import alarmApi from "@/apis/alarmApi";

const router = useRouter();
const store = useStore();

const userInfo = computed(() => store.getters["user/userInfo"]);

// 현재 로그인 정보로 초기값 세팅 (비밀번호는 새로 입력)
const userName = ref(userInfo.value?.userName || "");
const userEmail = ref(userInfo.value?.userEmail || "");
const address = ref(userInfo.value?.address || "");
const phone = ref(userInfo.value?.phone || "");
const password = ref("");
const showPassword = ref(false);
const channel = ref(getNotificationChannel()); // "WEBPUSH" | "FCM"

const isFormComplete = computed(
  () =>
    userName.value &&
    userEmail.value &&
    address.value &&
    phone.value &&
    password.value
);

// 회원 정보 수정 (이름/이메일/주소/비밀번호/전화번호만 변경 가능)
const handleUpdate = async () => {
  if (!isFormComplete.value) return;

  const userId = userInfo.value?.userId ?? userInfo.value?.id;

  try {
    await memberApi.updateUsers(userId, {
      userName: userName.value,
      userEmail: userEmail.value,
      address: address.value,
      password: password.value,
      phone: phone.value,
    });
    // 채널이 바뀐 경우에만 서버에 선호도 저장
    // (회원정보 수정은 이미 성공했으므로 실패해도 흐름은 막지 않음)
    if (channel.value !== getNotificationChannel()) {
      try {
        await alarmApi.savePreference({ userId, channel: channel.value });
        console.log("선호도 저장 성공");
      } catch (e) {
        console.error("알림 채널 서버 저장 실패:", e);
      }
    }
    setNotificationChannel(channel.value);


    // 헤더 등에 반영되도록 스토어 갱신 (비밀번호 제외)
    store.dispatch("user/login", {
      ...userInfo.value,
      userName: userName.value,
      userEmail: userEmail.value,
      address: address.value,
      phone: phone.value,
    });

    alert("회원 정보가 수정되었습니다!");
    router.push("/");
  } catch (err) {
    alert(err.response?.data || "회원 정보 수정 실패");
  }
};
</script>

<style scoped>
.signup-page {
  background: #fff;
  min-height: 100vh;
  padding: 100px 20px 60px;
}

.signup-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
}

.basic-info {
  max-width: 400px;
  margin: 0 auto 60px auto;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  outline: none;
}

input:focus {
  border-color: #71c0eb;
}

input:disabled {
  background: #f6f6f6;
  color: #999;
}

.password-box {
  position: relative;
  width: 100%;
}

.password-box input {
  width: 100%;
  padding-right: 38px;
}

.toggle-icon {
  position: absolute;
  right: 12px;
  top: 10px;
  font-size: 18px;
  color: #777;
  cursor: pointer;
}

.btn-submit {
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background: #71c0eb;
  border: none;
  color: #000;
  font-weight: 600;
  border-radius: 4px;
  padding: 12px 0;
  cursor: pointer;
  transition: 0.2s;
}

.btn-submit:disabled {
  background: #f1f2f3;
  color: #999;
  cursor: not-allowed;
}

.channel-box {
  display: flex;
  gap: 20px;
}

.channel-box label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  margin-bottom: 0;
}

.channel-box input {
  width: auto;
}
</style>
