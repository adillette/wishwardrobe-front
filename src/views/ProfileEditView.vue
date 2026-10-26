<template>
  <div class="signup-page">
    <!-- 비밀번호 확인 모달: 통과하기 전까지 수정 폼을 쓸 수 없다 -->
    <div v-if="!verified" class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-title"
        @keydown.esc="handleCancel"
      >
        <h3 id="verify-title">비밀번호 확인</h3>
        <p class="modal-desc">정보를 수정하려면 현재 비밀번호를 입력해 주세요.</p>

        <form @submit.prevent="handleVerify">
          <div class="password-box">
            <input
              ref="verifyInput"
              v-model="verifyPassword"
              :type="showVerifyPassword ? 'text' : 'password'"
              placeholder="현재 비밀번호"
              autocomplete="current-password"
            />
            <i
              :class="showVerifyPassword ? 'ri-eye-off-line' : 'ri-eye-line'"
              class="toggle-icon"
              @click="showVerifyPassword = !showVerifyPassword"
            ></i>
          </div>

          <p v-if="verifyError" class="error-text">{{ verifyError }}</p>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="handleCancel">취소</button>
            <button type="submit" class="btn-confirm" :disabled="!verifyPassword || verifying">
              {{ verifying ? "확인 중..." : "확인" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="signup-container" :class="{ locked: !verified }">
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
            <label>새 비밀번호 (변경할 때만 입력)</label>
            <div class="password-box">
              <input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="새 비밀번호를 입력하세요"
                autocomplete="new-password"
              />
              <i
                :class="showNewPassword ? 'ri-eye-off-line' : 'ri-eye-line'"
                class="toggle-icon"
                @click="showNewPassword = !showNewPassword"
              ></i>
            </div>
            <p v-if="newPasswordError" class="error-text">{{ newPasswordError }}</p>
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

          <!-- 버튼을 입력칸과 같은 컨테이너 안에 두어 폭이 항상 같게 맞춘다 -->
          <button type="submit" class="btn-submit" :disabled="!canSubmit">
            {{ submitting ? "수정 중..." : "수정 완료" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import memberApi from "@/apis/memberApi";
import { getNotificationChannel, setNotificationChannel } from "@/constants/user";
import alarmApi from "@/apis/alarmApi";

const router = useRouter();
const store = useStore();

const userInfo = computed(() => store.getters["user/userInfo"]);

// ---------- 비밀번호 확인 모달 ----------
const verified = ref(false);
const verifyPassword = ref("");
const showVerifyPassword = ref(false);
const verifyError = ref("");
const verifying = ref(false);
const verifyInput = ref(null);
// 확인을 통과한 현재 비밀번호. 새 비밀번호로 바꿀 때만 요청에 함께 보낸다
const currentPassword = ref("");

onMounted(async () => {
  await nextTick();
  verifyInput.value?.focus(); // 화면이 열리면 바로 입력할 수 있게 한다
});

const handleVerify = async () => {
  if (!verifyPassword.value || verifying.value) return;

  verifying.value = true;
  verifyError.value = "";
  try {
    // 서버가 토큰의 사용자 기준으로 bcrypt matches 검증을 한다. 프론트는 결과만 받는다
await memberApi.verifyPassword({ currentPassword: verifyPassword.value });    currentPassword.value = verifyPassword.value;
    verified.value = true;
  } catch (err) {
    const status = err.response?.status;
    // 서버는 비밀번호 불일치를 400 또는 403으로 응답해야 한다. 401이면 axios 공통 처리가 로그인 화면으로 보낸다
    verifyError.value =
      status === 400 || status === 403
        ? "비밀번호가 일치하지 않습니다."
        : "확인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    await nextTick();
    verifyInput.value?.focus();
  } finally {
    verifying.value = false;
    verifyPassword.value = ""; // 입력창의 값은 비운다
  }
};

const handleCancel = () => {
  router.push("/");
};

// ---------- 수정 폼 ----------
const trimmed = (v) => (v ?? "").trim();

// 화면을 연 시점의 값. 이 값과 비교해서 바뀐 항목만 보낸다
const initial = {
  userName: trimmed(userInfo.value?.userName),
  userEmail: trimmed(userInfo.value?.userEmail),
  address: trimmed(userInfo.value?.address),
  phone: trimmed(userInfo.value?.phone),
  channel: getNotificationChannel(), // "WEBPUSH" | "FCM"
};

const userName = ref(initial.userName);
const userEmail = ref(initial.userEmail);
const address = ref(initial.address);
const phone = ref(initial.phone);
const channel = ref(initial.channel);
const newPassword = ref("");
const showNewPassword = ref(false);
const submitting = ref(false);

// 값이 있고 원래 값과 다른 항목만 모은다. 빈 값은 서버가 "변경 안 함"으로 처리하므로 보내지 않는다
const changedProfile = computed(() => {
  const next = {
    userName: trimmed(userName.value),
    userEmail: trimmed(userEmail.value),
    address: trimmed(address.value),
    phone: trimmed(phone.value),
  };
  const result = {};
  for (const key of Object.keys(next)) {
    if (next[key] && next[key] !== initial[key]) {
      result[key] = next[key];
    }
  }
  return result;
});

// 새 비밀번호는 trim하지 않는다. 공백도 비밀번호의 일부로 취급한다
const newPasswordError = computed(() => {
  if (!newPassword.value) return "";
  if (newPassword.value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  if (newPassword.value === currentPassword.value) return "현재 비밀번호와 다른 비밀번호를 입력해 주세요.";
  return "";
});

const hasPasswordChange = computed(() => !!newPassword.value && !newPasswordError.value);
const hasProfileChanges = computed(() => Object.keys(changedProfile.value).length > 0);
const channelChanged = computed(() => channel.value !== initial.channel);

// 모든 칸이 채워졌는지가 아니라 "확인을 통과했고, 바뀐 것이 하나라도 있는지"로 판단한다
const canSubmit = computed(
  () =>
    verified.value &&
    !newPasswordError.value &&
    (hasProfileChanges.value || hasPasswordChange.value || channelChanged.value) &&
    !submitting.value
);
const handleUpdate = async () => {
  if (!canSubmit.value) return;

  submitting.value = true;
  // 알림 채널 저장(alarmApi)에만 쓴다. 회원정보 수정은 서버가 토큰에서 userId를 읽는다
  const userId = userInfo.value?.userId ?? userInfo.value?.id;

  try {
    // 1) 프로필: 바뀐 항목이 있을 때만 보낸다
    if (hasProfileChanges.value) {
      await memberApi.updateUsers(changedProfile.value);
      // 헤더 등에 반영되도록 스토어 갱신 (비밀번호 제외)
      store.dispatch("user/login", {
        ...userInfo.value,
        ...changedProfile.value,
      });
    }

    // 2) 비밀번호: 별도 API. 현재 비밀번호를 서버가 다시 확인한다
    if (hasPasswordChange.value) {
      await memberApi.updatePassword({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      });
    }

    // 3) 채널이 바뀐 경우에만 서버에 선호도 저장 (실패해도 흐름은 막지 않음)
    if (channelChanged.value) {
      try {
        await alarmApi.savePreference({ userId, channel: channel.value });
      } catch (e) {
        console.error("알림 채널 서버 저장 실패:", e);
      }
      setNotificationChannel(channel.value);
    }

    currentPassword.value = ""; // 사용이 끝난 비밀번호는 메모리에서 지운다
    newPassword.value = "";

    alert("회원 정보가 수정되었습니다!");
    router.push("/");
  } catch (err) {
    const data = err.response?.data;
    alert(typeof data === "string" ? data : data?.message || "회원 정보 수정 실패");
  } finally {
    submitting.value = false;
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

/* 확인 전에는 폼 내용을 흐리게 하고 조작을 막는다 */
.signup-container.locked {
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
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
  box-sizing: border-box; /* padding이 폭에 더해지지 않게 해서 입력칸과 버튼 폭을 맞춘다 */
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

.error-text {
  margin: 8px 0 0;
  font-size: 13px;
  color: #d93025;
}

.btn-submit {
  box-sizing: border-box;
  display: block;
  width: 100%; /* 부모(.basic-info) 폭 = 입력칸 폭 */
  margin-top: 30px;
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

/* ---------- 모달 ---------- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  box-sizing: border-box;
  width: 100%;
  max-width: 360px;
  background: #fff;
  border-radius: 8px;
  padding: 28px 24px 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
}

.modal-desc {
  margin: 0 0 18px;
  font-size: 13px;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions button {
  flex: 1;
  padding: 11px 0;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: #f1f2f3;
  color: #444;
}

.btn-confirm {
  background: #71c0eb;
  color: #000;
}

.btn-confirm:disabled {
  background: #f1f2f3;
  color: #999;
  cursor: not-allowed;
}
</style>