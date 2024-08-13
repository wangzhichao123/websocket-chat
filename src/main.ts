import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import 'element-plus/dist/index.css'
import utils from 'element-plus/es'
import Vant from "vant";
import "vant/lib/index.css";
import { socketManager } from './assets/socket'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@/styles/index.scss'
import Vue3EmojiPicker from 'vue3-emoji-picker'; // 引入表情包

import 'uno.css' //引入 unocss


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // 数据持久化


const app = createApp(App);
// app.config.productionTip = false; // 关闭生产提示
const dayjs = require("dayjs");
app.config.globalProperties.dayjs = dayjs;

// app.use(provideSocket); // 使用 provideSocket 提供全局 WebSocket 连接
// app.use(socketManager);
app.config.globalProperties.socketManager = socketManager; // Add socketManager to globalProperties

app.use(pinia);
app.component('Vue3EmojiPicker', Vue3EmojiPicker); // 注册表情包组件

app.use(utils)
app.use(router);
app.use(Vant); // Vant 是一个轻量、可定制的移动端组件库
app.mount("#app");


