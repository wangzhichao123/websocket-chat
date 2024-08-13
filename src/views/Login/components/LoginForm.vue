<template>
  <el-form
    v-show="getShow"
    ref="formLogin"
    :model="loginData.loginForm"
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
          登录
        </h2>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="username">
            <el-input
              v-model="loginData.loginForm.username"
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
            v-model="loginData.loginForm.password"
            placeholder="请输入密码"
            type="password"
            autocomplete="off"
            :prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
            <el-button class="w-[100%]" type="primary" @click="handleLogin()">登录</el-button>
        </el-form-item>
      </el-col>
      <el-col
        :span="24"
        style="padding-right: 10px; padding-left: 10px; margin-top: -20px; margin-bottom: -20px"
      >
        <el-form-item>
          <el-row justify="space-between" style="width: 100%">
            <el-col :span="6">
              <el-checkbox v-model="loginData.loginForm.rememberMe">
                {{ '记住我' }}
              </el-checkbox>
            </el-col>
            <el-col :offset="6" :span="12">
              <el-link style="float: right" type="primary">{{ '忘记密码' }}</el-link>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <el-row :gutter="5" justify="space-between" style="width: 100%">
            <el-col :span="8">
              <XButton
                :title="'手机登录'"
                class="w-[100%]"
                @click="setLoginState(LoginStateEnum.MOBILE)"
              />
            </el-col>
            <el-col :span="8">
              <XButton
                :title="'二维码登录'"
                class="w-[100%]"
                @click="setLoginState(LoginStateEnum.QR_CODE)"
              />
            </el-col>
            <el-col :span="8">
              <XButton
                :title="'注册'"
                class="w-[100%]"
                @click="setLoginState(LoginStateEnum.REGISTER)"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-divider content-position="center">{{ '其他登录' }}</el-divider>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <div class="w-[100%] flex justify-between">
            <Icon
              v-for="(item, key) in socialList"
              :key="key"
              :icon="item.icon"
              :size="30"
              class="anticon cursor-pointer"
              color="#999"
              @click="doSocialLogin(item.type)"
            />
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { Avatar, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { LoginStateEnum } from '@/enums';
import { socketManager } from '@/assets/socket';
import { CommandTypeEnum, LoginTypeEnum, StatusCodeEnum } from "@/enums/index";
import { setAccessToken } from "@/utils/auth"
import { useCache } from '@/hooks/web/useCache'
import { WsReqDTO } from "@/api/login/types";
import { startHeartbeat, LoginRules } from "@/utils/index"
import { useLoginState } from '@/stores/user'

const { getLoginState, setLoginState } = useLoginState()
const wsRef = ref<WebSocket | null>(null);
const message = ref('');

const { wsCache } = useCache()

const router = useRouter();
const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)
const loginData = reactive({
  loginForm: {
    username: "111",
    password: "123456",
    rememberMe: true,
  },
});

const socialList = [
  { icon: 'ant-design:wechat-filled', type: 30 },
  { icon: 'cib:tencent-qq', type: 30 },
  { icon: 'ant-design:dingtalk-circle-filled', type: 20 },
  // { icon: 'ant-design:github-filled', type: 0 },
  { icon: 'ant-design:alipay-circle-filled', type: 0 }
];

const doSocialLogin = (type: number) => {
  ElMessage({
    message: "暂不支持该登录方式",
    type: "warning",
  });
};

onUnmounted(() => {
  // 关闭 socket
  if (socketManager.getSocket() && socketManager.getSocket().readyState === WebSocket.OPEN) {
    socketManager.close();
  }
});


const formLogin = ref();

const handleLogin = async () => {
  try {
    // await login(loginData.loginForm);
    const form = unref(formLogin);
    if (!form) return;
    const data = await form.validate();  // 失败 则 reject
    if (!data) {
      console.log('校验失败');
      return
    }
    const user = unref(loginData.loginForm);
    
    const passwordValue = user.password.trim();
    const userIdValue = user.username.trim();
    if (passwordValue.length < 2) {
      alert("密码不小于2位");
      return;
    }

    const connectWebSocket = () => {
      // 1. 连接socket
      socketManager.connect(); 
      // 2. 获取socket
      const ws: WebSocket = socketManager.getSocket();
      // 3. 要发送的消息
      const wsReqDTO: WsReqDTO = { 
        cmd: String(CommandTypeEnum.LOGIN), 
        data: {
          loginData: {
            userId: userIdValue, 
            password: passwordValue
          }, 
          loginType: String(LoginTypeEnum.EMAIL)
        },
        token: ''
      };
      
      // 4. WebSocket 连接完成后发送数据
      ws.addEventListener('open', (e) => { 
        console.log('WebSocket connection established');
        // 发送心跳包
        startHeartbeat();
        ws.send(JSON.stringify(wsReqDTO));
      });
      ws.addEventListener('close', handleWsClose);
      ws.addEventListener('error', handleWsError);
      ws.addEventListener('message', handleWsMessage);
      wsRef.value = ws;
    };

    // const handleWsOpen = () => {
    //   console.log('WebSocket connection established');
    // };

    const handleWsClose = () => {
      console.log('login WebSocket connection closed');
      message.value = 'login 连接关闭，请刷新重试！';
      // handlewsConnectException(message.value);
    };

    const handleWsError = (event) => {
      console.error('WebSocket error:', event);
      message.value = '连接错误，请刷新重试或检查网络！';
      handlewsConnectException(message.value);
    };

    const handleWsMessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);

      // if (data.type === '3') {
      if (data.code === StatusCodeEnum.LOGIN_SUCCESS) {
        console.log('Current route:', router.currentRoute.value.path);
        wsCache.set('username', data.data.nickname, {exp: 7 * 24 * 60 * 60});
        wsCache.set('userId', data.data.userId, {exp: 7 * 24 * 60 * 60});
        setAccessToken(data.data.token);    // 保存 token, 7 天
        ElMessage({
          message: "登录成功",
          type: "success",
        });
        router.push({ path: '/chat' }).catch(err => {
          console.error(err);
        });
      } 
      else if (data.code === StatusCodeEnum.LOGIN_ERROR) {
        handlewsConnectException(data.msg);
        // message.value = '用户名已存在，请重新输入！';
      }
    };

    connectWebSocket();
    
  } catch (error) {
    handlewsConnectException("登录失败！");
  }
};


const handlewsConnectException = (message: string) => {
  ElMessage({
    message: message,
    type: "error",
    duration: 3000,
  });
};
</script>

<style lang="scss" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.login-code {
  float: right;
  width: 100%;
  height: 38px;

  img {
    width: 100%;
    height: auto;
    max-width: 100px;
    vertical-align: middle;
    cursor: pointer;
  }
}

</style>
