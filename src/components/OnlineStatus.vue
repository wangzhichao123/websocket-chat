/* eslint-disable */

<template>
    <div class="online-status">
      <slot></slot><div class="status-indicator" :class="{ 'online': isOnline }"></div><span class="status-text">{{ onlineStatus }}</span>
    </div>
</template>
  
<script setup lang="ts">
    // import { useUserStore } from '@/stores/user';
    // const userStore = useUserStore();
    import { defineProps } from 'vue'
    defineProps(['isOnline', 'onlineStatus']);
    // const isOnline = ref(false);
    onMounted(() => {
        
    });
</script>
  
<style scoped>
  .online-status {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  
  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: translateY(16px); /* 向下移动 */
    background-color: #ee1111;
  }
  
  .status-indicator.online {
    background-color: #67C23A;
  }

  .status-text {
    font-size: 14px;
    color: white;
    transform: translateY(16px); /* 向下移动 */
  }
</style>