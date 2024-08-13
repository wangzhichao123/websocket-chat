/**
 * 全局枚举文件
 * 如果枚举值需要在全局使用，那么请在此文件中定义。其他枚举值请在对应的文件中定义。
 * 定义规则：
 *  枚举名：XxxEnum
 *  枚举值：全部大写，单词间用下划线分割
 */
/** -------------------------------------- */


/** 命令类型 1.登录 2.发送消息 3.心跳 */
export enum CommandTypeEnum {
  /** 1.登录 */
  LOGIN = 1,
  /** 2.发送消息 */
  SEND_MESSAGE,
  /** 3.心跳 */
  HEARTBEAT,
  /** 4.确认消息 */
  CONFIRM_MESSAGE,
}

/** 登录类型 1.邮箱登录 2.账号登录 3.手机登录 */
export enum LoginTypeEnum {
  /** 1.邮箱登录 */
  EMAIL = 1,
  /** 2.账号登录 */
  ACCOUNT,
  /** 3.手机登录 */
  PHONE
}

/** 状态码类型 */
export enum StatusCodeEnum {
  /** 登录成功 */
  LOGIN_SUCCESS = 10001,
  /** 登录出错 */
  LOGIN_ERROR = 10002,
  /** 收到私聊消息 */
  RECEIVE_PRIVATE_MESSAGE = 10003,
  /** 收到群聊消息 */
  RECEIVE_GROUP_MESSAGE = 10004,
  /** 收到好友列表 */
  RECEIVE_FRIEND_LIST = 10005,
  /** 收到群列表 */
  RECEIVE_GROUP_LIST = 10006,
  /** 收到好友申请 */
  RECEIVE_FRIEND_APPLY = 10007,
  /** 收到群申请 */
  RECEIVE_GROUP_APPLY = 10008,
  /** 收到好友申请回复 */
  RECEIVE_FRIEND_APPLY_REPLY = 10009,

}


export enum MessageTypeEnum {
  /** 1. 文本 */
  TEXT = 1,
  /** 2. 图片 */
  IMAGE,
  /** 3. 文件 */
  FILE,
  /** 4. 语音 */
  VOICE,
  /** 5. 视频 */
  VIDEO,
  /** 6. 表情包 */
  EMOJI
}

export enum GroupTypeEnum {
  /** 1. 群聊 */
  GROUP = 1,
  /** 2. 私聊 */
  PRIVATE,
}

export enum LoginStateEnum {
  /** 1. 手机号登录*/
  MOBILE = 1,
  /** 2. 二维码登录*/
  QR_CODE,
  /** 3. 注册*/
  REGISTER,
  /** 4. 重置密码*/
  RESET_PASSWORD,
  /** 5. 登录*/
  LOGIN,
  /** 6. SSO*/
  SSO,
}

