<template>
  <h2 class="enter-x mb-3 text-center text-2xl font-bold xl:text-center xl:text-3xl">
    {{ getFormTitle }}
  </h2>
</template>
<script lang="ts" setup>
import { LoginStateEnum } from '@/enums'

defineOptions({ name: 'LoginFormTitle' })

// const { t } = useI18n()

// const { getLoginState } = useLoginState()

const getLoginState = ref(LoginStateEnum.LOGIN)

const getFormTitle = computed(() => {
  const titleObj = {
    [LoginStateEnum.RESET_PASSWORD]: 'reset password',
    [LoginStateEnum.LOGIN]: 'login',
    [LoginStateEnum.REGISTER]: 'register',
    [LoginStateEnum.MOBILE]: 'mobile',
    [LoginStateEnum.QR_CODE]: 'qr code',
    [LoginStateEnum.SSO]: 'sso'
  }
  return titleObj[unref(getLoginState)]
})
</script>
