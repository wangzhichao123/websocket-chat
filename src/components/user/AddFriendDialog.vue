<template>
    <div>
      <Icon icon="ph:plus-bold" @click="showDialog = true"></Icon>
  
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
              <el-button @click="searchFriend">搜索</el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="friendInfo" label="好友信息" :label-width="formLabelWidth">
            <div class="friend-info">
                <div class="friend-nickname">{{ friendInfo.nickname }}</div>
                <div class="friend-id">{{ friendInfo.userId }}</div>
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="addFriend" :disabled="!friendInfo">添加</el-button>
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
  
      const searchFriend = (event) => {
        // 假设搜索好友的接口为 /user/searchFriend
        event.preventDefault(); // 防止默认行为，例如表单提交
        request.post({url: 'api/user/search/relationship', params: {userId: form.value.userToId}})
          .then(res => {
            friendInfo.value = res;
          })
          .catch(err => {
            console.error('搜索失败', err);
          });
      };
  
      const addFriend = () => {
        console.log('添加好友:', form.value);
        // 提交表单，进行添加好友
        request.post({url: 'api/user/add', params:{userToId: form.value.userToId, userFromId: form.value.userFromId}}).then(res => {
          console.log(res);
        })
        showDialog.value = false;
        resetForm();
      };
  
      return {
        showDialog,
        form,
        friendInfo,
        formLabelWidth,
        addFriend,
        resetForm,
        searchFriend
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
  flex-direction: column;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  .friend-nickname {
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 5px;
    color: #333;
   }

   .friend-id {
    font-size: 0.9em;
    color: #777;
  }
}


  </style>
  