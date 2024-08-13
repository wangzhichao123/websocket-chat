import { AxiosPromise } from "axios"
import { CSSProperties } from "vue"

// import { CommandEnum } from "@/enums/index";
export type WsReqDTO = {
  /** 1: "登录消息" 2: "发送消息" 3: "确认消息" 4: "心跳消息" */
  cmd: string,
  data: LoginDTO | MsgDTO
  token: string
}

export type LoginDTO = {
  loginData: LoginData,
  loginType: string,
}

export type LoginData = {
  userId: string, 
  password: string
}

export type MsgDTO = {
  /** 消息id */
  messageId: string,
  /** 发送用户id */
  userFromId: string,
  /** 接收用户id */
  userToId: string,
  /** 群id */
  groupId: string,
  /** 是否群发 "1" 私聊 "2" 群发 */
  MessageType: string,
 /** 发送消息类型 1: 文本和表情包 2: 图片 3: 文件 4: 语音 5: 视频 */
  sendMessageType: string,
  /** 发送时间 */
  sendTime: string,
  /** 接收时间 */
  receiveTime: string,
  /** 发送消息内容 */
  sendMessageContent: string
}

export type MsgConfirmDTO = {
  messageId: string,
  userFromId: string,
  userToId: string,
  groupId?: string,
  sendTime: string,
}

export type MessageVO = {
  messageId: string,
  userFromId: string,
  username: string,
  sendTime: string,
  messageContent: string,
  status: string
}

// ---------------- 注册 表单 start ----------------

export type FormSchema = {
  // 唯一值
  field: string
  // 标题
  label?: string
  // 提示
  labelMessage?: string
  // col组件属性
  colProps?: ColProps
  // 表单组件属性，slots对应的是表单组件的插槽，规则：${field}-xxx，具体可以查看element-plus文档
  componentProps?: { slots?: Recordable } & ComponentProps
  // formItem组件属性
  formItemProps?: FormItemProps
  // 渲染的组件
  component?: ComponentName
  // 初始值
  value?: FormValueType
  // 是否隐藏
  hidden?: boolean
  // 远程加载下拉项
  api?: <T = any>() => AxiosPromise<T>
}

export type FormValueType = string | number | string[] | number[] | boolean | undefined | null

export type FormItemProps = {
  labelWidth?: string | number
  required?: boolean
  rules?: Recordable
  error?: string
  showMessage?: boolean
  inlineMessage?: boolean
  style?: CSSProperties
}

export type ComponentOptions = {
  label?: string
  value?: FormValueType
  disabled?: boolean
  key?: string | number
  children?: ComponentOptions[]
  options?: ComponentOptions[]
} & Recordable

export type ComponentOptionsAlias = {
  labelField?: string
  valueField?: string
}

export type ComponentProps = {
  optionsAlias?: ComponentOptionsAlias
  options?: ComponentOptions[]
  optionsSlot?: boolean
} & Recordable


export type ComponentName =
  | 'Radio'
  | 'RadioButton'
  | 'Checkbox'
  | 'CheckboxButton'
  | 'Input'
  | 'Autocomplete'
  | 'InputNumber'
  | 'Select'
  | 'Cascader'
  | 'Switch'
  | 'Slider'
  | 'TimePicker'
  | 'DatePicker'
  | 'Rate'
  | 'ColorPicker'
  | 'Transfer'
  | 'Divider'
  | 'TimeSelect'
  | 'SelectV2'
  | 'TreeSelect'
  | 'InputPassword'
  | 'Editor'
  | 'UploadImg'
  | 'UploadImgs'
  | 'UploadFile'

export type ColProps = {
  span?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  tag?: string
}

// ---------------- 注册 表单 end----------------

export type UserLoginVO = {
  username: string
  password: string
  captchaVerification: string
  socialType?: string
  socialCode?: string
  socialState?: string
}

export type TokenType = {
  /**编号*/
  id: Number
  /**访问令牌*/
  accessToken: string 
  /**刷新令牌*/
  refreshToken: string 
  /**用户编号*/
  userId: number 
  /**用户类型*/
  userType: number 
  /**客户端编号*/
  clientId: string 
  /**过期时间*/
  expiresTime: number 
}

export type UserVO = {
  id: number
  username: string
  nickname: string
  deptId: number
  email: string
  mobile: string
  sex: number
  avatar: string
  loginIp: string
  loginDate: string
}
