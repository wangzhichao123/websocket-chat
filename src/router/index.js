import Home from "../views/Home.vue";
import { createRouter as _createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "chatXXX",     // name 不能重复
    redirect: "/login",
    // component: Home,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      keepAlive: false, // 是否缓存页面
    },
    component: () =>
      import( "../views/Login.vue"),
  },
  {
    path: "/login_form",
    name: "LoginForm",
    meta: {
      keepAlive: false,
    },
    component: () =>
      import( "../views/Login/components/LoginForm.vue"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      keepAlive: false,
    },
    component: Home,
  },
  {
    path: "/chat",
    name: "Chat",
    meta: {
      keepAlive: false,
    },
    component:() =>
      import( "../views/Chat.vue"),
  },
  // {
  //   path: "/chat",
  //   name: "ChatBar",
  //   component: () => import("../views/Chat.vue"),
  // },
  // {
  //   path: "/test",
  //   name: "Test",
  //   component: () => import("../views/Test.vue"),
  // },
  // {
  //   path: "/aaa",
  //   name: "aaa",
  //   component: () => import("../views/AAA.vue"),
  // },
];

const router = new _createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
