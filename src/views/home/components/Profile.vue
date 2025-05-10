<template>
    <div class="avatar-dropdown">
      <!-- 头像圆框 -->
      <div class="avatar" @click="toggleDropdown">
        <img src="../../../img/avatar.jpg" alt="Avatar">
      </div>
      <!-- 下拉选项 -->
      <div v-if="isDropdownVisible" class="dropdown">
        <div class="triangle"></div>
        <div class="dropdown-item" @click="homeCenter(map)">我的家</div>
        <div class="dropdown-item" @click="schoolCenter(map)">公司/学习</div>
        <RouterLink to="/profile"><div class="dropdown-item">退出登录</div></RouterLink>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
    // 接收父组件传递的地图实例
    const props = defineProps({
        map: {
            type: Object,
            required: true
        }
    });
    // 控制下拉菜单的显示与隐藏
    const isDropdownVisible = ref(false);
    
    // 切换下拉菜单的显示状态
    const toggleDropdown = () => {
        isDropdownVisible.value =!isDropdownVisible.value;
    };
    // 家
    const homeCenter = function (map){
        const point = [12708412.973162018, 3582849.0216611675];
        // props.map.getView().setCenter(point);
        map.getView().setCenter(point);
        map.getView().setZoom(17.5);

    }
    // 公司/学校
    const schoolCenter = function (map){
        const point = [12758612.973162018, 3562849.0216611675];
        // props.map.getView().setCenter(point);
        map.getView().setCenter(point);
        map.getView().setZoom(17.5);

    }

  </script>
  
  <style scoped>
  .avatar-dropdown {
    position: absolute;
    top: 76px;
    right: 50px;
    display: inline-block;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .dropdown {
    position: absolute;
    top: 100%;
    right:  -10px;
    margin-top: 10px;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
    min-width: 120px;
    z-index: 1;
  }
  .triangle{
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid white;
    position: relative;
    right: -80px;
  }
  .dropdown-item {
    padding: 10px 15px;
    background-color: #fff;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .dropdown-item:hover {
    background-color: #f0f0f0;
  }
  </style>