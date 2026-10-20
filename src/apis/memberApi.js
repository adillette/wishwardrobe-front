
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
 * 회원 정보 수정
 */
function updateUsers(userId, data) {
  return memberApi.put("/users/update", data, {
    params: { userId }
  });
}

export default {
  register,
  login,
  updateUsers,
};
