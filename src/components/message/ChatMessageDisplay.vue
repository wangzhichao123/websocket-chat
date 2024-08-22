<template>
    <div class="chat-container">
      <el-avatar :src="avatarUrl" class="avatar"></el-avatar>
      <div class="chat-info">
        <div class="nickname">{{ nickname }}</div>
        <div class="chat-message">{{ formattedMessage }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps } from 'vue';
  import { ElAvatar } from 'element-plus';
  import 'element-plus/es/components/avatar/style/css';
  
  const props = defineProps({
    chatBoxData: {
      type: Array,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
  });
  
  const latestMessage = computed(() => {
    // if (props.chatBoxData.length > 0) {
    //   return props.chatBoxData[props.chatBoxData.length - 1].message;
    // }
    return 'No messages No messages No messages No messages No messages No messages No messages No messages';
  });
  
  const messageCount = computed(() => {

    return 10;
    // return props.chatBoxData.length;
  });
  
  const formattedMessage = computed(() => {
    const message = latestMessage.value.length > 30
      ? latestMessage.value.slice(0, 30) + '...'
      : latestMessage.value;
  
    return `[${messageCount.value}条]：${message}`;
  });
  </script>
  
  <style scoped lang="scss">
  .chat-container {
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f5f5f5;
    margin-bottom: 10px;
  
    .avatar {
      width: 40px;
      height: 40px;
      flex-shrink: 0; /* 防止在 flex 布局中缩小 */
      margin-right: 10px;
    }
  
    .chat-info {
      display: flex;
      width: calc(100% - 40px);
      flex-direction: column;
    }
  
    .nickname {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 4px;
    }
  
    .chat-message {
      font-size: 16px;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  </style>
  