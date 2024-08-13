/* eslint-disable */
<template>
  <el-container class="all-background">
    <!-- lt-2xl:w-6xl lt-2xl:h-screen-sm -->
    <el-container class="my-container">
      <el-aside class="left-list mr-1">
          <el-container class="list-header">
            <OnlineStatus :isOnline="Msg === '在线中'" :onlineStatus="Msg">
              <el-avatar class="avatar" size="default" fit="fit"> {{username}} </el-avatar>
            </OnlineStatus>
            <el-button class="circle-button" type="primary" circle>
              <AddFriendDialog :userId="currUserUid"/>
            </el-button>
          </el-container>
          <el-container>
            <el-row class="w-8 p-2 bg-sky-400 content-start">
              <el-col class="my-3">
                <el-icon><Icon class="cursor-pointer" icon="websymbol:chat" /></el-icon>
              </el-col>
              <el-col class="my-3">
                <el-icon><Icon class="cursor-pointer" icon="weui:contacts-filled" /></el-icon>
              </el-col>
              <el-col class="my-3">
                <el-icon><Icon class="cursor-pointer" icon="material-symbols:group-work" /></el-icon>
              </el-col>
              <!-- 更多 el-col -->
            </el-row>
            <el-scrollbar style="height: 696px;" class="flex-1 bg-yellow-100">
              <el-menu :default-openeds="['1', '3']">
                <el-sub-menu index="1">
                  <template #title>
                      <el-icon>
                          <message />
                      </el-icon>联系人
                  </template>
                  <el-menu-item-group v-for="filteredItem in filteredUserList" :key="filteredItem.userId">
                      <el-menu-item :index="String(filteredItem.userId)" @click="handleSelectUser(filteredItem)" style="height: 40px;">
                          {{ filteredItem.nickname }}
                      </el-menu-item>
                  </el-menu-item-group>
                </el-sub-menu>
              </el-menu>
            </el-scrollbar>
          </el-container>
      </el-aside>
      <el-container class="content flex flex-col bg-amber-200 p-1">
        <el-container class="content-area flex-1 mb-1">
          <el-header style="font-size: 18px; height: 36px; line-height: 36px; padding: 4px; font-weight: bold;">
            <div class="header-title">{{ headerTitle }}</div>
          </el-header>
          <el-main style="margin-top: 1px; padding: 0;">
            <!-- el-scrollbar 要先设置 高度 -->
            <el-scrollbar class="chat-room" id="chat-room" ref="chatRoom" style="margin-top: 1px; height: 660px;" always
            :native="false"
            @scroll="handleScroll"   
            >
              <div v-for="item in MsgList" :key="item.messageId" ref="innerRef"
                  style="margin-top: 10px;margin-bottom: 20px;">
                  <!-- 左边 -->
                  <div v-if="currUserUid !== item.userFromId" style="margin-left: 10px;margin-bottom: 8px;">
                      <el-row class="row-bg" type="flex" align="middle">
                          <el-avatar size="default" fit="fit">{{ item.userFromId }}</el-avatar>
                          <span style="margin-left: 10px">{{ dayjs(item.sendTime).format("YYYY-MM-DD HH:mm") }}</span>
                      </el-row>

                      <el-row>
                          <el-col :span="1000" :offset="1" class="msg" style="margin-top: 10px;margin-left: 40px;">
                              {{ item.messageContent }}
                          </el-col>
                      </el-row>
                  </div>
                  <!-- 右边 -->
                  <div v-else style="margin-right: 10px;margin-bottom: 8px;">
                      <el-row class="row-bg" type="flex" justify="end" align="middle">
                          <span style="margin-right: 10px">{{ dayjs(item.sendTime).format("YYYY-MM-DD HH:mm")
                          }}</span>

                          <el-avatar size="default" fit="fit"> {{ item.userFromId }} </el-avatar>
                      </el-row>

                      <el-row justify="end">
                          <!-- 加载动画 -->
                          <el-col :span="1" style="margin-top: 20px;">
                            <LoadingComponent :visible="item.status !== 'success'" :isLoading="item.status === 'loading'" :isError="item.status === 'error'" />
                          </el-col>
                          <el-col :span="1000" class="msg2" style="margin-right: 20px;">
                              {{ item.messageContent }}
                          </el-col>
                      </el-row>
                  </div>
              </div>
            </el-scrollbar>
          </el-main>
        </el-container>
        <el-container class="footer-area h-10 flex-none">
          <el-input class="h-10 relative" v-model="inputValue" placeholder="请输入消息按Enter发送" @keydown.enter="sendMessage" clearable>
            <template #append>
              <!-- 元素 上下居中 左右对齐 -->
              <Icon class="cursor-pointer pr-[8px]" icon="fluent:emoji-32-regular" @click="showEmojiPicker = !showEmojiPicker" ref="emojiIconRef" />
              <Icon class="cursor-pointer pl-[8px]" icon="material-symbols:upload" @click="showFileDialog" style="border-left: 1px solid #ccc ;"/>
              <EmojiPicker 
                v-show="showEmojiPicker"
                :native="true"
                @select="onSelectEmoji"
                class="absolute translate-y-[-180px] translate-x-[-150px]" 
                ref="emojiPickerRef"
              />

            </template>
          </el-input>
          <el-button class="h-10 " type="primary" size="default" @click="sendMessage">
            发送
          </el-button>
        </el-container>
      </el-container>
    </el-container>
  </el-container>
</template>
    
<script setup lang="ts">  // 要求 入口文件 为 ts类型
import Icon from '@/components/icon/Icon.vue'
// import picker compopnent
import EmojiPicker from 'vue3-emoji-picker'
// import css
import 'vue3-emoji-picker/css'
import {  Message } from '@element-plus/icons-vue';
import { useCache } from '@/hooks/web/useCache'
import { socketManager } from '@/assets/socket';
import { StatusCodeEnum, CommandTypeEnum } from "@/enums/index";
import { useUserStore } from '@/stores/user';
import { MessageVO, MsgConfirmDTO} from '@/api/login/types';
import { GroupTypeEnum, MessageTypeEnum } from '@/enums/index';
import dayjs from 'dayjs';
import { ElScrollbar, ElNotification  } from 'element-plus';
import { startHeartbeat } from '@/utils/index';
import request from '@/config/axios/index'
const innerRef = ref(null);

const userStore = useUserStore();

const router = useRouter();
const { wsCache } = useCache()

let ws = socketManager.getSocket();

const messageType = ref(GroupTypeEnum.PRIVATE);
const currUserUid = ref('')
const username = ref(wsCache.get("username") || '');
const userList = ref([
  // {userId: 1, nickname: '张三1'},
]);

const filteredUserList = computed({
  get() {
    return userList.value.filter((item) => {
      return true;
    });
  },
  set(newValue) {
    console.log('filteredUserList newValue', newValue);
  }
});


// ----------------- emoji picker 点击事件处理 -----------------
const emojiIconRef = ref<InstanceType<typeof Icon> | null>(null); // 使用组件的类型
const emojiPickerRef = ref<InstanceType<typeof EmojiPicker> | null>(null); // 为组件引用指定类型

const handleClickOutside = (event) => {
  const emojiPickerEl = emojiPickerRef.value?.$el || emojiPickerRef.value;
  const emojiIconEl = emojiIconRef.value?.$el || emojiIconRef.value;
  // 判断点击事件是否发生在emojiPickerEl或emojiIconEl上
  if (emojiPickerEl && !emojiPickerEl.contains(event.target as Node) && 
      emojiIconEl && !emojiIconEl.contains(event.target as Node)) {
    showEmojiPicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
//----------------- emoji picker 点击事件处理结束 -----------------

const selectContactId = ref('');
const headerTitle = ref('');
const inputValue = ref('');
const Msg = ref("不在线");

const MsgList = ref<MessageVO[]>([]);

// 滚动容器
const chatRoom = ref<InstanceType<typeof ElScrollbar> | null>(null); // 定义chatRoom为ElScrollbar实例或null

// ---------- 处理滚动 ----------
const handleScroll = async (event) => {
  // event 包含 scrollTop 和 scrollLeft 两个属性
  const container = chatRoom.value?.wrapRef; // 获取实际的滚动容器元素
  if (container){
    if (event.scrollTop === 0) {
      // 滚动到顶部,请求更多消息
      const preScrollHeight = container.scrollHeight;
      await loadMoreMessages(); // 等待异步加载完成
      const newScrollHeight = container.scrollHeight;
      // 计算新旧内容高度的差值，并调整 scrollTop
      const addedContentHeight = newScrollHeight - preScrollHeight;
      // const srcollbar = chatRoom.value?.$el.querySelector('.el-scrollbar__wrap'); // 获取滚动条元素
      // const thumb = chatRoom.value?.$el.querySelector('.el-scrollbar__thumb'); // 获取滑块元素
      // console.log('加载消息之后', srcollbar, thumb);
      container.scrollTop =  addedContentHeight;
    }
  }
};

const loadMoreMessages = async () => {
  try {
    // const newMessages = await fetchMoreMessages();
    const newMessages: MessageVO[] = [];
    MsgList.value = [...newMessages, ...MsgList.value];
  } catch (error) {
    console.error('Failed to load more messages:', error);
  }
};
// ---------- 处理滚动 ----------



// ---------- 表情包 ----------

const showEmojiPicker = ref(false);

const onSelectEmoji = (emoji) => {
  // console.log(emoji);
  inputValue.value += emoji.i;
  /*
    // result
    { 
        i: "😚", 
        n: ["kissing face"], 
        r: "1f61a", // with skin tone
        t: "neutral", // skin tone
        u: "1f61a" // without tone
    }
    */
}

// ---------- 文件上传 ----------
const showFileDialog = () => {
  console.log("点击文件上传");
  
}


// ---------- 聊天 ----------

const handleSelectUser = (item) => {
  selectContactId.value = item.userId;
  headerTitle.value = item.nickname;
  messageType.value = GroupTypeEnum.PRIVATE;
}

const sendMessage = () => {
  if (inputValue.value.trim().length === 0) {
    return;
  }
  // 发送消息
  console.log("发送消息");
  const maxChars: number = 4000;
  const sendMsg = inputValue.value.substring(0, maxChars); // 最多发送4000字
  inputValue.value = '';
  const msgId_uuid = generateUUID();
  if (messageType.value === GroupTypeEnum.PRIVATE){
    // 发送消息
    socketManager.sendMsg(sendMsg, currUserUid.value, selectContactId.value, msgId_uuid);
    let obj: MessageVO = {
      messageId: msgId_uuid,
      userFromId: currUserUid.value,
      username: username.value,
      sendTime: new Date().toLocaleString(),
      messageContent: sendMsg,
      status: "loading"
    }
    MsgList.value.push(obj);
  }
  else if (messageType.value === GroupTypeEnum.GROUP){
    socketManager.sendMsg(sendMsg, currUserUid.value, selectContactId.value, msgId_uuid, String(GroupTypeEnum.GROUP), String(MessageTypeEnum.TEXT), "111");
  }
};

onUnmounted(() => {
  // 关闭 socket
  if (socketManager.getSocket() && socketManager.getSocket().readyState === WebSocket.OPEN) {
    socketManager.close();
  }
});
onMounted(() => {
  username.value = wsCache.get("username");
  currUserUid.value = wsCache.get("userId");
  if (!currUserUid.value) {
      router.push("/login");
      return;
  }
  // 设置用户在线状态
  userStore.updateUserOnline(true);
  console.log("userStore.userOnline", userStore.userOnline);
  
  socketManager.connect();
  ws = socketManager.getSocket();
  console.log("ws", ws);
  ws.addEventListener("open", handlewsOpen, false);
  ws.addEventListener("close", handlewsClose, false);
  ws.addEventListener("error", handlewsError, false);
  ws.addEventListener("message", handlewsMessage, false);
  

});

const AccessTokenKey = 'ACCESS_TOKEN';
const jwtToken = wsCache.get(AccessTokenKey);
const token = `Bearer ${jwtToken}`;

const handlewsOpen = (e) => {
    Msg.value = "连接成功";
    console.log("websocket open 前端handlewsOpen连接成功");
    socketManager.getSocket().send(JSON.stringify({ cmd: String(CommandTypeEnum.LOGIN), data: {  }, token: token}))
    // 发送心跳包
    startHeartbeat();
};
const handlewsClose = (e) => {
    console.log("websocket close 前端关闭连接", e);
    Msg.value = "连接关闭,请刷新重试!";
    handlewsConnectException(Msg.value);
};
const handlewsError = (e) => {
    console.log("websocket error 前端错误", e);
    Msg.value = "连接错误,请刷新重试或者检查网络!";
    handlewsConnectException(Msg.value);
};
const handlewsMessage = (e) => {
    let data = JSON.parse(e.data);
    console.log("websocket message 前端接收", data);
    if (data.code === StatusCodeEnum.LOGIN_ERROR) {
      Msg.value = data.msg;
      handlewsConnectException(data.msg);
    }
    else if (data.code === StatusCodeEnum.LOGIN_SUCCESS) {
      Msg.value = "在线中";
      //初始化用户列表和群组列表
      // 获取用户列表
      request.post<any>({
        url: `/api/user/relationship?userId=${currUserUid.value}`,
      }).then((res) => {
        console.log("获取用户列表", res);
        userList.value = res;
      }).catch((err) => {
        console.log("获取用户列表失败", err);
      });
    }
    // if (data.code === StatusCodeEnum.RECEIVE_PRIVATE_MESSAGE)
    else  {
      console.log("接收到私聊消息");
      console.log(data);
      // 添加到消息列表
      const newMessages: MessageVO = {
        messageId: data.data.messageId,
        userFromId: data.data.userFromId,
        username: data.data.username,
        sendTime: data.data.sendTime,
        messageContent: data.data.sendMessageContent,
        status: "success"
      };
      MsgList.value = [...MsgList.value, newMessages];
      // 消息确认
      const confirm: MsgConfirmDTO = { 
        messageId: data.data.messageId,
        userToId: data.data.userToId,
        userFromId: data.data.userFromId,
        sendTime: data.data.sendTime,
        
      }
      socketManager.getSocket().send(JSON.stringify({ cmd: String(CommandTypeEnum.CONFIRM_MESSAGE), data: confirm, token: token }))
    }
    
    return;
};

const handlewsConnectException = (message: string) => {
  // 创建蒙层
  const overlayElement = document.createElement('div');
  overlayElement.className = 'overlay';
  document.body.appendChild(overlayElement);

  return new Promise<void>((resolve) => {
    // 显示通知
    ElNotification({
      message: message,
      type: 'error',
      duration: 3000, // 控制显示时长，单位是毫秒，3000ms = 3秒
      position: 'top-right', // 控制通知显示的位置，可以是 'top-right', 'top-left', 'bottom-right', 'bottom-left'
      customClass: 'notification-on-top', // 添加自定义类以控制 z-index
      onClose: () => resolve() // 当通知关闭时，调用 resolve
    });
  }).then(() => {
    // 在通知关闭后跳转页面
    router.push('/login');
    // 移除蒙层
    document.body.removeChild(overlayElement);
  });
};

const generateUUID = () =>  {
  // "10e7072d-a19e-4b9c-a4d3-c2fd03b61a46"
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

</script>
    
<style lang='scss' scoped>
@import '../styles/components/home.scss';

html, body {
    margin: 0;
    padding: 0;
    height: 100%; /* 确保 body 占据整个视口 */
}

.all-background {
    width: 100%;
    height: 100vh;
    min-width: 1500px;
    min-height: 800px;
    background: linear-gradient(to right, #f38b8b, #ebc37a);
    position: relative;
    overflow: hidden;
}

.my-container {
    height: 800px;
    width: 1500px;
    background-color: rgb(40, 42, 55);
    position: absolute; /* 使用绝对定位 */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* 居中元素 */
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: row;

    .left-list {
        flex: 1;
        height: 100%;
        background-color: aqua;
    }

    .content {
        flex: 3;
        height: 100%;
        // background-color: bisque;
    }
}


.list-header {
    display: flex;
    align-items: center; // 垂直居中
    justify-content: space-between; // 所有子元素均匀分布,第一个元素位于起点,最后一个元素位于终点,中间的元素会等距分布。
    padding: 0.5rem;

    .avatar {
        img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
    }

    .circle-button {
        width: 40px;
        height: 40px;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .el-icon {
            font-size: 20px;
            
        }
    }
}

.chat-room {
    background-color: antiquewhite;
    .msg {
      background-color: #12B7F5;
      /* box-shadow: rgba(18, 23, 45, 0.6) 0px 8px 24px; */
      border-radius: 4px;
      padding: 10px;
      font-size: 18px;
      line-height: 16px;
      /* width: auto; */
      /* max-width: 330px; */
      margin-top: 20px;
      color: white;
  }

  .msg2 {
      background-color: #12B7F5;
      /* box-shadow: rgba(18, 23, 45, 0.6) 0px 8px 24px; */
      border-radius: 4px;
      padding: 10px;
      font-size: 18px;
      line-height: 16px;
      /* width: auto; */
      /* max-width: 330px; */
      margin-top: 20px;
      color: white;
  }
}


// 蒙层样式 全局样式
:global(.overlay) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* 通知样式，使其 z-index 高于蒙层 */
:global(.notification-on-top) {
  z-index: 10000 !important;
}
</style>