<template>
    <div class="profile-fullscreen">
      <div class="profile-content">
        <div class="avatar-section">
          <img src="../../img/avatar.jpg" alt="头像" class="avatar">
        </div>
        <div class="info-section">
          <div class="info-item">
            <span class="info-label">昵称:</span>
            <span v-if="!isEditing">{{ userInfo.nickname }}</span>
            <input v-if="isEditing" v-model="userInfo.nickname" type="text" class="info-input">
          </div>
          <div class="info-item">
            <span class="info-label">生日:</span>
            <span v-if="isEditing === false">{{ userInfo.birthday }}</span>
            <input v-if="isEditing" v-model="userInfo.birthday" type="text" class="info-input">
          </div>
        </div>
        <div class="action-buttons">
          <button v-if="!isEditing" @click="startEdit" class="edit-btn">编辑资料</button>
          <div v-if="isEditing" class="edit-buttons">
            <button @click="saveChanges" class="save-btn">保存</button>
            <button @click="cancelEdit" class="cancel-btn">取消</button>
          </div>
          <button @click="logout" class="logout-btn">退出登录</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 用户信息
  const userInfo = ref({
    avatar: 'https://example.com/avatar.jpg', // 请替换为实际头像链接
    nickname: 'John Doe',
    birthday: '1995-05-10'
  });
  
  // 编辑状态
  const isEditing = ref(false);
  
  // 开始编辑
  const startEdit = () => {
    isEditing.value = true;
  };
  
  // 保存修改
  const saveChanges = () => {
    // 这里可以添加保存到后端的逻辑，例如使用axios发送请求
    console.log('保存的用户信息:', userInfo.value);
    isEditing.value = false;
  };
  
  // 取消编辑
  const cancelEdit = () => {
    isEditing.value = false;
  };
  
  // 退出登录
  const logout = () => {
    // 这里可以添加退出登录的逻辑，例如清除token、跳转到登录页等
    alert('即将退出')
    console.log('执行退出登录操作');
  };
  </script>
  
  <style scoped>
  .profile-fullscreen {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
  }
  
  .profile-content {
    width: 100vw;
    height: 100vh;
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
  }
  
  .avatar-section {
    margin-bottom: 20px;
  }
  
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .info-section {
    margin-bottom: 20px;
  }
  
  .info-item {
    margin-bottom: 15px;
    text-align: left;
  }
  
  .info-label {
    display: inline-block;
    width: 80px;
    color: #666;
  }
  
  .info-input {
    width: calc(100% - 80px);
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .edit-btn,
  .save-btn,
  .cancel-btn,
  .logout-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .edit-btn {
    background-color: #007BFF;
    color: white;
    width: 200px;
  }
  
  .save-btn {
    background-color: #28a745;
    color: white;
  }
  
  .cancel-btn {
    background-color: #dc3545;
    color: white;
 
  }
  
  .logout-btn {
    background-color: #6c757d;
    color: white;
    width: 200px;
  }
  
  .edit-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
  </style>