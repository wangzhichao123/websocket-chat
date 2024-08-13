import { socketManager } from '../assets/socket';


export const socket = {
  
  /**
   * 向服务器发送指令 在 socketManager.connect() 方法之后使用
   * @param command 指令
   * @param data 数据
   */
  sendCommandToServer(command: number, data: any) {
    // 将指令和数据封装为一个对象
    const message = JSON.stringify({
      cmd: command,
      loginData: data,
    });
  
    // 发送数据到服务器
    const socket = socketManager.getSocket() as never as WebSocket;
    console.log(socket, "websocket");
    if (socket && socket.readyState === WebSocket.OPEN) {
      
      
      socket.send(message);
    }
  },

  /**
   * websocket进行连接
   * @param url websocket地址
   */
  connect(url: string) {
    socketManager.connect(url);
  },

  getSocket() {
    return socketManager.socket.value;
  }


} 