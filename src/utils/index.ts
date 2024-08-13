/* eslint-disable */
import { socketManager } from '@/assets/socket'
import { CommandTypeEnum } from '@/enums'

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
    if (!str) return ''
    return str.replace(/\-(\w)/g, (_, letter: string) => {
      return letter.toUpperCase()
    })
}


/**
 * @param timeout 心跳包发送间隔
 * @returns void
 */
export const startHeartbeat = (timeout: number = 5000) => {
  const ws: WebSocket = socketManager.getSocket()
  setInterval(() => { sendHeartbeat(ws)}, timeout) // 每 5 秒发送一次心跳包
};

const sendHeartbeat = (ws: WebSocket) => {
  if (ws.readyState === WebSocket.OPEN) {
      console.log('发送心跳包')
      ws.send(JSON.stringify({ cmd: String(CommandTypeEnum.HEARTBEAT), data: {} }))
  }
};

export const LoginRules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
  ],
});