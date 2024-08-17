<template>
    <div>
      <Icon icon="ph:plus-bold" @click.prevent="showDialogFun"></Icon>
  
      <el-dialog
        title="添加好友"
        v-model="showDialog"
        width="30%"
        @close="resetForm"
      >
        <el-form :model="form">
          <el-form-item label="好友账户" :label-width="formLabelWidth">
            <div class="search-container">
              <el-input v-model="form.userToId" autocomplete="off" @keydown.enter="searchFriend"></el-input>
              <el-button @click.prevent="searchFriend">搜索</el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="friendInfo" label="好友信息" :label-width="formLabelWidth">
            <div class="friend-info">
                <el-avatar :src="friendInfo.userAvatar" fit="cover"></el-avatar>
                <div class="friend-details">
                    <div class="friend-nickname">用户昵称: {{ friendInfo.nickname }}</div>
                    <div class="friend-id">用户ID: {{ friendInfo.userId }}</div>
                </div>
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <div v-if="addFriendFlag">
            <el-button @click.prevent="noShowDialog">取消</el-button>
            <el-button type="primary" @click.prevent="addFriend" :disabled="!friendInfo">添加</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script lang="ts">
  import request from '@/config/axios/index'
  
  export default {
    name: 'AddFriendDialog',
    props: {
      userId: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      // 使用解构来访问 props
      const { userId } = toRefs(props);
      const showDialog = ref(false);
      const addFriendFlag = computed(() => {
        return friendInfo.value != null;
      });;
      const form = ref({
        userToId: '',
        userFromId: userId.value
      });
      const friendInfo = ref(null);
      const formLabelWidth = '100px';
  
      const resetForm = () => {
        form.value.userToId = '';
        friendInfo.value = null;
      };
  
      const searchFriend = () => {
        // 假设搜索好友的接口为 /user/searchFriend
        request.post({url: 'api/user/search/relationship', params: {userId: form.value.userToId}})
          .then(res => {
            friendInfo.value = res;
            // console.log('搜索结果', res);
          })
          .catch(err => {
            console.error('搜索失败', err);
          });
      };
  
      const addFriend = (event) => {
        console.log('添加好友:', form.value);
        event.stopPropagation();
        // 提交表单，进行添加好友
        request.post({url: 'api/user/add', params:{userToId: form.value.userToId, userFromId: form.value.userFromId}}).then(res => {
          console.log(res);
        })
        showDialog.value = false;
      };

      const showDialogFun = () => {
        showDialog.value = true;
        console.log('点击添加好友');
        
      };

      const noShowDialog = (event) => {
        event.stopPropagation();
        showDialog.value = false;
      };
  
      return {
        addFriendFlag,
        showDialog,
        form,
        friendInfo,
        formLabelWidth,
        addFriend,
        resetForm,
        searchFriend,
        showDialogFun,
        noShowDialog
      };
    }
  };
  </script>
  
  <style scoped>
  .dialog-footer {
    text-align: right;
  }
  
  .search-container {
    display: flex;
    align-items: center;
  
    el-input {
      flex: 1;
      margin-right: 10px;
    }
  }

  .friend-info {
    display: flex;
    flex-direction: row; 
    align-items: center; 
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    > *:not(:last-child) {
      margin-right: 10px;
    }

    .friend-details {
      display: flex;
      flex-direction: column; 
    }

    .friend-nickname {
      margin-bottom: 5px;
      font-size: 0.9em;
      color: #777;
    }

    .friend-id {
      font-size: 0.9em;
      color: #777;
    }
  }




  </style>
  