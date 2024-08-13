/* eslint-disable */
<template>
    <el-form
    v-show="getShow"
    ref="formRegister"
    :model="registerData.loginForm"
    :rules="LoginRules"
    class="login-form"
    label-position="top"
    label-width="120px"
    size="large"
  >
      <el-row style="margin-right: -10px; margin-left: -10px">
        <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <h2
            class="enter-x mb-3 text-center text-2xl font-bold xl:text-center xl:text-3xl"
            >
            注册
            </h2>
        </el-col>
        <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item prop="username">
                <el-input
                v-model="registerData.loginForm.username"
                placeholder="请输入用户名"
                type="text"
                autocomplete="off"
                :prefix-icon="Avatar"
                ></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item prop="password">
            <el-input
                v-model="registerData.loginForm.password"
                placeholder="请输入密码"
                type="password"
                autocomplete="off"
                :prefix-icon="Lock"
                show-password
            ></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item prop="password">
            <el-input
                v-model="registerData.loginForm.confirmPassword"
                placeholder="请再次输入密码"
                type="password"
                autocomplete="off"
                :prefix-icon="Lock"
                show-password
            ></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item>
                <el-button class="w-[100%]" type="primary" @click="loginRegister()">注册</el-button>
            </el-form-item>
        </el-col>
        <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item>
                <XButton
                :title="'返回登录'"
                class="w-[100%]"
                @click="handleBackLogin()"
                />
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </template>
  <script lang="ts" setup>
  import { ElMessage } from 'element-plus'
  import { Avatar, Lock } from '@element-plus/icons-vue'
  import { LoginRules } from "@/utils/index"
  import { LoginStateEnum } from '@/enums'
  import { useLoginState } from '@/stores/user'
  import request from '@/config/axios/index'
  
  defineOptions({ name: 'RegisterForm' })

  const formRegister = ref();

  const registerData = reactive({
    loginForm: {
        username: "",
        password: "",
        confirmPassword: "",
    },
  });
  
  const { handleBackLogin, getLoginState } = useLoginState()
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER)
  
  const loginRegister = async () => {
    const form = unref(formRegister)
    if (!form) return
    const data = await form.validate(); // 失败 则 reject
    if (!data) {
      console.log('注册校验失败')
      return
    }
    const user = unref(registerData.loginForm)
    if (user.password !== user.confirmPassword) {
      ElMessage.error('两次密码不一致')
      return
    }
    const registerDTO = {
      userId: user.username,
      password: user.password
    }
    // 提交表单，进行注册
    request.post({url: '/user/register', data: registerDTO}).then(res => {
      console.log(res);
    })
  }
  </script>
  
    