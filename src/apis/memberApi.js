
import { memberApi } from "./axiosConfig";
/**
 * 회원가입
 */
function register(data) {
  return memberApi.post("/users/register", data);
}

/**
 * 로그인
 */
function login(data) {
  return memberApi.post("/users/login", data);
}

/**
 * 회원 정보 수정(비밀번호 제외)
 */
function updateUsers(data) {
  return memberApi.put("/users/update", data );
}

//비밀번호 수정
function updatePassword(data) {
  return memberApi.put("/users/updatepw", data); 
}

function verifyPassword({  currentPassword }) {
  return memberApi.post("/users/verify-password", { password: currentPassword });
}

export default {
  register,
  login,
  updateUsers,
  updatePassword,
  verifyPassword
};
