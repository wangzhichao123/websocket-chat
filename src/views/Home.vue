<template>
    <el-container class="layout-container-demo" style="height: 500px">
        <el-aside width="200px">
            <el-scrollbar>
                <el-menu :default-openeds="['1', '3']">
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <message />
                            </el-icon>联系人
                        </template>
                        <el-menu-item-group v-for="filteredItem in filteredUserList" :key="filteredItem.uid">
                            <el-menu-item :index="String(filteredItem.uid)" @click="handleSelectUser(filteredItem)" style="height: 40px;">
                                {{ filteredItem.name }}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon><icon-menu /></el-icon>群组
                        </template>
                        <el-menu-item-group v-for="item in groupList" :key="item.gid">
                            <!-- <template #title>Group 1</template> -->
                            <el-menu-item :index="String(item.gid)" @click="handleSelectGroup">{{ item.name
                            }}</el-menu-item>
                            <!-- <el-menu-item index="2-2">Option 2</el-menu-item> -->
                        </el-menu-item-group>
                    </el-sub-menu>
                </el-menu>
            </el-scrollbar>
        </el-aside>

        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <div class="header-title">{{ headerTitle }}</div>
                <div class="toolbar">
                    <el-text class="mx-1" type="primary" style="margin-right: 10px;">{{ message }}</el-text>
                    <!-- 重新连接websocket按钮 -->
                    <ElButton type="primary" style="margin-right: 10px;" @click="reconnect()">重新连接</ElButton>

                    <el-dropdown>
                        <el-icon style="margin-right: 10px; margin-top: 1px" size="25px">
                            <setting />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>View</el-dropdown-item>
                                <el-dropdown-item>Add</el-dropdown-item>
                                <el-dropdown-item>Delete</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <span @click="updateUser()" style=" margin-left: 30px; color: #12B7F5; text-decoration: underline; cursor: pointer;
        ">修改用户名</span>
                    <input type="text" v-if="isUpdate" v-model="newUserName" />
                    <span v-if="isUpdate" @click="makeSure">确定</span>


                    <div>
                        <span style=" margin-right: 10px;margin-left: 10px;">{{ username }}</span>
                        <el-avatar size="default" fit="fit"> {{ username }} </el-avatar>
                    </div>
                </div>
            </el-header>

            <el-main style="margin-top: 1px;">
                <el-scrollbar class="chat-room" id="chat-room" ref="chatRoom" style="margin-top: 1px" always
                    >

                    <div v-for="item in MsgList" :key="item.mid" ref="innerRef"
                        style="margin-top: 10px;margin-bottom: 20px;">
                        <!-- 左边 -->
                        <div v-if="uid === item.uid" style="margin-left: 10px;margin-bottom: 8px;">
                            <el-row class="row-bg" type="flex" align="middle">
                                <el-avatar size="default" fit="fit">{{ item.username }}</el-avatar>
                                <span style="margin-left: 10px">{{ dayjs(item.time).format("YYYY-MM-DD HH:mm") }}</span>
                            </el-row>

                            <el-row>
                                <el-col :span="1000" :offset="1" class="msg" style="margin-top: 10px;margin-left: 40px;">
                                    {{ item.text }}
                                </el-col>
                            </el-row>
                        </div>
                        <!-- 右边 -->
                        <div v-else style="margin-right: 10px;margin-bottom: 8px;">
                            <el-row class="row-bg" type="flex" justify="end" align="middle">
                                <span style="margin-right: 10px">{{ dayjs(item.time).format("YYYY-MM-DD HH:mm")
                                }}</span>

                                <el-avatar size="default" fit="fit"> {{ item.username }} </el-avatar>
                            </el-row>

                            <el-row justify="end">
                                <el-col :span="1000" class="msg2" style="margin-right: 20px;">
                                    {{ item.text }}
                                </el-col>
                            </el-row>
                        </div>
                    </div>

                </el-scrollbar>

            </el-main>
            <el-row class="row-bg" type="flex" justify="space-around" align="middle">
                <el-col :span="20">
                    <el-input type="text" style="width: 100%" autofocus @keyup.enter="handleSendBtnClick"
                        placeholder="请输入消息按Enter发送" v-model="currentMsg"></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button class="sendBtn" @click="handleSendBtnClick" type="primary" size="default">
                        发送
                    </el-button>
                </el-col>
            </el-row>
        </el-container>
    </el-container>
</template>
  
<script lang="ts">
import { ElAvatar, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElMenu, ElMenuItem, ElMenuItemGroup, ElScrollbar, ElRow, ElCol, ElButton } from 'element-plus'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import { socketManager } from '../assets/socket';
import { ref } from 'vue';
import { useCache } from '@/hooks/web/useCache'
import { CommandTypeEnum } from "../enums/index";

const { wsCache } = useCache()

let ws = socketManager.getSocket();
export default {
    setup() {
        const innerRef = ref(null);
        return {
            innerRef,
        };
    },
    name: "Home",
    components: {
        ElAvatar,
        ElDropdown,
        ElDropdownItem,
        ElDropdownMenu,
        ElIcon,
        ElMenu,
        ElMenuItem,
        ElMenuItemGroup,
        ElScrollbar,
        IconMenu,
        Message,
        Setting,
        ElRow,
        ElCol,
        ElButton
    },
    data() {
        return {
            max: 0,
            type: "MESSAGE_CHAT_GROUP",
            userMsg:
            {
                id: "",
                uid: "",
                user: "",
                tid: "",
                dateTime: "",
                text: "testmsg",
            },
            groupMsg: {
                id: "",
                uid: "",
                gid: "",
                gname: "",
                user: "",
                dateTime: "",
                text: "this is a test",
            },
            message: "在线中",
            currentMsg: "",
            newUserName: "",
            isUpdate: false,
            username: wsCache.get("username"),
            contentHeight: 490,
            chatRoom: null,
            userList: [
                {
                    uid: 1,
                    name: "张三1"
                },
                {
                    uid: 2,
                    name: "张三2"
                },
                {
                    uid: 3,
                    name: "张三3"
                },
            ],
            groupList: [],
            // userMsgList: [],
            // groupMsgList: [],
            MsgList: [],
            conversitionList: [],
            headerTitle: "",
        };
    },
    beforeUnmount() {
        // 关闭 socket
        socketManager.close();
    },
    //watch 中的函数, 给一个变量发送变化的回调函数, 如果变
    mounted() {
        this.username = wsCache.get("username");
        console.log("username", this.username);

        if (!this.username) {
            this.$router.push("/login");
            return;
        }
        socketManager.connect();
        ws = socketManager.getSocket();
        console.log("ws", ws);
        ws.addEventListener("open", this.handlewsOpen.bind(this), false);
        ws.addEventListener("close", this.handlewsClose.bind(this), false);
        ws.addEventListener("error", this.handlewsError.bind(this), false);
        ws.addEventListener("message", this.handlewsMessage.bind(this), false);
        // 发送心跳包
        this.startHeartbeat();
    },
    computed: {
        filteredUserList() {
            // 使用 computed 属性过滤数组
            return this.userList.filter((item) => {
                return true;
            }); 
        },
    },
    watch: {
        MsgList: {
            handler() {
                this.$nextTick(() => {
                    this.updateMax();
                    this.scrollToBottom();
                });
            },
            deep: true,
        },
    },
    methods: {
        startHeartbeat() {
            setInterval(() => { this.sendHeartbeat()}, 30000) // 每 30 秒发送一次心跳包
        },
        sendHeartbeat() {
            if (socketManager.getSocket().readyState === WebSocket.OPEN) {
                console.log('发送心跳包');
                socketManager.getSocket().send(JSON.stringify({ cmd: String(CommandTypeEnum.HEARTBEAT), data: {} }))
            }
        },

        reconnect() {
            //先关闭之前的连接
            socketManager.close();
            console.log("socketManager.getSocket().readyState", socketManager.getSocket().readyState);
            if (socketManager.getSocket().readyState !== WebSocket.OPEN) {
                // socketManager.connect('ws://127.0.0.1:9000/ws');
                socketManager.connect();
            }
            else {
                return;
            }
            //wait 1 seconds for connection to establish
            setTimeout(function () {
                if (socketManager.getSocket().readyState === WebSocket.OPEN) {
                    console.log("socketManager.getSocket().readyState", socketManager.getSocket().readyState);
                    //do something with the websocket
                }
            }, 1000);
            ws = socketManager.getSocket();
            ws.addEventListener("open", this.handlewsOpen.bind(this), false);
            ws.addEventListener("close", this.handlewsClose.bind(this), false);
            ws.addEventListener("error", this.handlewsError.bind(this), false);
            ws.addEventListener("message", this.handlewsMessage.bind(this), false);
        },
        updateMax() {
            if (this.innerRef) {
                const arraySize = Object.keys(this.innerRef).length;
                console.log("Array Size:", arraySize);
                this.max = arraySize * 100 + 1000;
            }
        },

        scrollToBottom() {
            const scrollbar = this.$refs.chatRoom;
            // scrollbar.setScrollTop(this.max);

        },

        handlewsOpen(e) {
            this.message = "连接成功";
            console.log("websocket open 前端handlewsOpen连接成功");
            // this.get_init_data();
            // this.handleSelectUser({ index: this.uid })
            // this.handleSelectGroup({ index: this.gid })
            this.message = "在线中";
        },
        handlewsClose(e) {
            console.log("websocket close 前端关闭连接", e);
            this.message = "连接关闭,请刷新重试!";
        },
        handlewsError(e) {
            console.log("websocket error 前端错误", e);
            this.message = "连接错误,请刷新重试或者检查网络!";
        },
        handlewsMessage(e) {
            let data = JSON.parse(e.data);
            console.log("websocket message 前端接收", data);
            //初始化用户列表和群组列表
            return;
        },
        updateUser() {
            this.isUpdate = true;
        },
        makeSure() {
            this.isUpdate = false;
            this.username = this.newUserName;
            localStorage.setItem("username", this.username); //set username to local storage for reuse.  (username is the key)
        },
    },
};
</script>

  
<style scoped>
.layout-container-demo .el-header {
    position: relative;
    /* background-color: var(--el-color-primary-light-7); */
    color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    /* background: var(--el-color-primary-light-8); */
}

.layout-container-demo .el-menu {
    border-right: none;
}

.layout-container-demo .el-main {
    padding: 0;
}

.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 5px;
}

.chat-room {
    background-color: antiquewhite;
}

.chat-room .msg {
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


.header-title{
    display: inline-block;
    float: left;
    margin-top: 16px;
    margin-left: 10px;
    font-size: 20px;
    font-weight: bold;
}
</style>
  