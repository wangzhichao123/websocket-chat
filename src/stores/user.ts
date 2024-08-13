import { ref } from 'vue'
import { LoginStateEnum } from '@/enums'
// import apis from '@/services/apis'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userOnline = ref(false)

  const updateUserOnline = (online: boolean) => {
    userOnline.value = online
  }
  return { userOnline, updateUserOnline }
});

/**
 * 登录状态
 */
export const useLoginState = defineStore('loginState', () => {
  const currentState = ref(LoginStateEnum.LOGIN)
  const setLoginState = (state: LoginStateEnum) => {
    currentState.value = state
  }
  // 注意 .value 的问题
  const getLoginState = computed(() => currentState)
  const handleBackLogin = () => {
    setLoginState(LoginStateEnum.LOGIN)
  }
  return { setLoginState, getLoginState, handleBackLogin }
});
