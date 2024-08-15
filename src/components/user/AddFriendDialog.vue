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
              <el-input v-model="form.friendAccount" autocomplete="off"></el-input>
              <el-button @click="searchFriend">搜索</el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="friendInfo" label="好友信息" :label-width="formLabelWidth">
            <div>{{ friendInfo.name }}</div>
            <div>{{ friendInfo.email }}</div>
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
        friendAccount: '',
        userId: userId.value
      });
      const friendInfo = ref(null);
      const formLabelWidth = '100px';
  
      const resetForm = () => {
        form.value.friendAccount = '';
        friendInfo.value = null;
      };
  
      const searchFriend = () => {
        // 假设搜索好友的接口为 /user/searchFriend
        request.post({url: 'api/user/search/relationship', params: {account: form.value.friendAccount}})
          .then(res => {
            friendInfo.value = res.data;
          })
          .catch(err => {
            console.error('搜索失败', err);
          });
      };
  
      const addFriend = () => {
        console.log('添加好友:', form.value);
        // 提交表单，进行添加好友
        request.post({url: '/user/addFriend', data: form.value}).then(res => {
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
  </style>
  