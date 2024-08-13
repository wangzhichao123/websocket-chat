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
          <el-form-item label="好友名称" :label-width="formLabelWidth">
            <el-input v-model="form.friendName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="好友账户" :label-width="formLabelWidth">
            <el-input v-model="form.friendAccount" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="addFriend">添加</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
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
        friendName: '',
        friendAccount: '',
        userId: userId.value
      });
      const formLabelWidth = '100px';
  
      const resetForm = () => {
        form.value.friendName = '';
        form.value.friendAccount = '';
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
        formLabelWidth,
        addFriend,
        resetForm
      };
    }
  };
  </script>
  
  <style scoped>
  .dialog-footer {
    text-align: right;
  }
  </style>
  