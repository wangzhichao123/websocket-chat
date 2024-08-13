<template>
  <div>init</div>
</template>
  
<script lang='ts'>
import { defineComponent, defineOptions } from 'vue'
  
export default defineComponent({
  name: 'LoginTemp',
  setup() {
    // todo
    return {}
  }
})
</script>
  
<style lang='stylus' scoped></style>
  
<!-- /* eslint-disable */
<template>
  <div class="about">
    <h3 style="color: #576c99">
      欢迎来到在线聊天系统!请输入用户名
    </h3>
    <van-row type="flex" justify="center">
      <van-col span="6"></van-col>
      <van-col span="6">
        <input type="text" placeholder="请输入用户ID" autofocus v-model="userId" />
        <input type="text" placeholder="请输入用户密码" autofocus v-model="password" />
        <van-button @click="handleEnterBtnClick" color="#576c99" size="normal"
          style="margin-top: 30px">进入聊天室</van-button></van-col>
      <van-col span="6"></van-col>
    </van-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { socketManager } from '@/assets/socket';
import { useRouter } from 'vue-router';
import { CommandTypeEnum, LoginTypeEnum, StatusCodeEnum } from "@/enums/index";
import { setAccessToken } from "@/utils/auth"
import { useCache } from '@/hooks/web/useCache'
import { WsReqDTO } from "@/api/login/types";
const router = useRouter();
const wsRef = ref<WebSocket | null>(null);
const message = ref('');
const password = ref('');
const userId = ref('');

const { wsCache } = useCache()

const handleEnterBtnClick = () => {
  const passwordValue = password.value.trim();
  const userIdValue = userId.value.trim();
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
        token: "",
        loginType: String(LoginTypeEnum.EMAIL)
      }
    };
    // 4. WebSocket 连接完成后发送数据
    ws.addEventListener('open', () => { 
      console.log('WebSocket connection established');
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
    console.log('WebSocket connection closed');
    message.value = '连接关闭，请刷新重试！';
  };

  const handleWsError = (event) => {
    console.error('WebSocket error:', event);
    message.value = '连接错误，请刷新重试或检查网络！';
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
      router.push({ path: '/home' }).catch(err => {
        console.error(err);
      });
    } else {
      message.value = '用户名已存在，请重新输入！';
    }
  };

  connectWebSocket();
};

onMounted(() => {

});
</script>

<style scoped lang="css">
.about {
  align-items: center;
  text-align: center;
  margin: 100px 30px;
}

.about input {
  width: 300px;
  height: 45px;
  padding: 6px 8px;
  border: 2px solid;
  border-color: #576c99;
  caret-color: #576c99;
  caret-shape: underscore;
}
</style> -->
