// socket.js

import { ref } from 'vue';
import { useCache } from '@/hooks/web/useCache'
import { CommandTypeEnum, MessageTypeEnum, GroupTypeEnum} from "@/enums/index";
import { WsReqDTO } from "@/api/login/types";
import { ElMessage } from 'element-plus';

export const CONNECT_URL: string = 'ws://192.168.1.114:7979/ws'; // Replace with the actual WebSocket URL

class SocketManager {
  public socket: ReturnType<typeof ref>; // 使用ref创建的响应式引用
  constructor() {
    this.socket = ref(null);
  }

  connect(url: string = CONNECT_URL) {
    // 重新连接之前，关闭之前的连接
    // const ws: WebSocket = this.getSocket();
    // if (ws && ws.readyState === WebSocket.OPEN){
    //   ws.close();
    // }
    this.socket.value = new WebSocket(url);
    // const ws = this.getSocket();
    // ws.onopen = () => {
    //   console.log('WebSocket connection opened');
    // };
    // ws.onclose = (event) => {
    //   console.log('WebSocket connection closed:', event);
    // };
    // ws.onerror = (error) => {
    //   console.error('WebSocket error:', error);
    // };
  }
  
  getSocket() {
    return this.socket.value as unknown as WebSocket;
  }

  close() {
    if (!this.socket.value)
      this.getSocket().close();
  }

  sendMsg(msgContent: string, userFromId: string, userToId: string, messageId: string, sendMessageType: string = String(GroupTypeEnum.PRIVATE),
          messageType: string = String(MessageTypeEnum.TEXT), groupId: string = '') {
    const { wsCache } = useCache();
    const AccessTokenKey = 'ACCESS_TOKEN';
    const jwtToken = wsCache.get(AccessTokenKey);
    const token = `Bearer ${jwtToken}`;

    const wsReqDTO: WsReqDTO = { 
      cmd: String(CommandTypeEnum.SEND_MESSAGE),
      data: {
        messageId: messageId,
        userFromId: userFromId,
        userToId: "222", // userToId
        groupId: groupId,
        // cmd: String(CommandTypeEnum.SEND_MESSAGE),
        MessageType: messageType,
        sendMessageType: sendMessageType,
        sendTime: new Date().toLocaleDateString(),
        sendMessageContent: msgContent,
        receiveTime: '',
      },
      token: token,
    };
    
    if (this.getSocket().readyState === WebSocket.OPEN){
      this.getSocket().send(JSON.stringify(wsReqDTO));
    }
    else{
      ElMessage.error('socket未连接');
    }
  }
}

const socketManager = new SocketManager();

console.log('socketManager', socketManager);
export { socketManager };

