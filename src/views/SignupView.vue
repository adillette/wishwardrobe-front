<template>
  <div class="signup-page">
    <div class="signup-container">
      <h2>회원가입</h2>

      <form @submit.prevent="handleSignup">
        <!-- 기본 정보 -->
        <div class="form-section basic-info">
          <div class="input-group">
            <label>이름</label>
            <input v-model="name" type="text" placeholder="이름을 입력하세요" />
          </div>

          <div class="input-group">
            <label>아이디</label>
            <input v-model="username" type="text" placeholder="아이디를 입력하세요" />
          </div>

          <div class="input-group">
            <label>비밀번호</label>
            <div class="password-box">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="비밀번호를 입력하세요" />
              <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'" class="toggle-icon"
                @click="showPassword = !showPassword"></i>
            </div>
          </div>

          <div class="input-group">
            <label>이메일</label>
            <input v-model="email" type="email" placeholder="이메일을 입력하세요" />
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
          회원가입 완료
        </button>

        <router-link to="/login" class="btn-login-link">로그인</router-link>
      </form>
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import memberApi from "@/apis/memberApi";
import { getNotificationChannel, setNotificationChannel } from "@/constants/user";   // ✅ 회원가입 API import

const router = useRouter();

const name = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const channel = ref(getNotificationChannel()); // "WEBPUSH" | "FCM"


const address = ref("");
const phone = ref("");


const isFormComplete = computed(
  () =>
    name.value &&
    username.value &&
    email.value &&
    password.value &&
    address.value &&
    phone.value
);

// =========================
// 🚀 회원가입 API 호출
// =========================
const handleSignup = async () => {
  if (!isFormComplete.value) return;

  try {
    await memberApi.register({
     userName: name.value,     
      loginId: username.value,
      password: password.value,
      userEmail: email.value,   
      address: address.value,
      phone: phone.value,
    });

    setNotificationChannel(channel.value);
    alert("회원가입이 완료되었습니다!");
    router.push("/login");

  } catch (err) {
    alert(err.response?.data || "회원가입 실패");
  }
};

</script>

<style scoped>
.signup-page {
  background: #fff;
  min-height: 100vh;
  padding: 60px 20px;
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
  width: 100%;
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

.btn-submit:hover:enabled {
  background: #71c0eb;
}

.btn-login-link {
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #111;
  font-size: 14px;
  text-decoration: none;
  font-weight: 500;
}

.btn-login-link:hover {
  color: #71c0eb;
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
