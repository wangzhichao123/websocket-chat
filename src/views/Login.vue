/* eslint-disable */
<template>
  <div class="about">
    <h3 style="color: #576c99">
      欢迎来到在线聊天系统!请输入用户名
    </h3>
    <van-row type="flex" justify="center">
      <van-col span="6"></van-col>
      <van-col span="6">
        <input type="text" placeholder="请输入用户ID" autofocus v-model="userId" />
        <input type="text" placeholder="请输入用户名" autofocus v-model="username" />
        <van-button @click="handleEnterBtnClick" color="#576c99" size="normal"
          style="margin-top: 30px">进入聊天室</van-button></van-col>
      <van-col span="6"></van-col>
    </van-row>
  </div>
</template>

<script setup>
import { User, Message, MessageType } from "../assets/entity.js";
import { ref, onMounted } from 'vue';
import { socketManager } from '../assets/socket.js';
import { useRouter } from 'vue-router';
// import router from "@/router";
const router = useRouter();
const wsRef = ref(null);
const message = ref('');
const username = ref('');
const userId = ref('');

const check = () => {
  const sessionID = localStorage.getItem("sessionID");
  if (sessionID) {
    console.log("1111");
    wsRef.value.send(
      JSON.stringify({
        type: MessageType.MESSAGE_LOGIN,
        data: {
          sessionID: sessionID,
        },
      })
    );
    console.log("websocket message 前端发送", {
      type: MessageType.MESSAGE_LOGIN,
      data: {
        sessionID: sessionID,
      },
    });
  } else {
    console.log("2222");
  }
};

const handleEnterBtnClick = () => {
  const usernameValue = username.value.trim();
  const userIdValue = userId.value.trim();
  if (usernameValue.length < 2) {
    alert("用户名不小于2位");
    return;
  }

  const connectWebSocket = () => {
    const ws = new WebSocket(`ws://127.0.0.1:7979/websocket?userId=${userIdValue}`);
    wsRef.value = ws;

    ws.addEventListener('open', handleWsOpen);
    ws.addEventListener('close', handleWsClose);
    ws.addEventListener('error', handleWsError);
    ws.addEventListener('message', handleWsMessage);
  };

  const handleWsOpen = () => {
    console.log('WebSocket connection established');
  };

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

    if (data.type === 3) {
      // 打印当前路由位置
      console.log('Current route:', router.currentRoute.value.path);
      // localStorage.setItem('username', data.username);
      // localStorage.setItem('uid', data.uid);
      // localStorage.setItem('sessionID', data.sessionID);
      console.log("kkk")
      router.push({ path: '/' }).catch(err => {
        console.error(err);
      });
    } else {
      message.value = '用户名已存在，请重新输入！';
    }
  };

  connectWebSocket();
};

onMounted(() => {
  check();
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
</style>
