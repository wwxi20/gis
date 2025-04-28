<template>
    <div class="search-container">
    <div class="search-box">    
    <input type="text" v-model="keyword" placeholder="输入关键字搜索">
    <button @click="searchPOI">搜索</button>
    </div>
    <ul v-show="searchResults.length > 0">
      <li v-for="(result, index) in searchResults" :key="index">
        {{ result.name }} - {{ result.address }}
      </li>
    </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 定义响应式数据
const keyword = ref('');
const searchResults = ref([]);

// 天地图 API 密钥
const apiKey = 'e2d035db12beacb76df2c1efc7ec03ab';

// 搜索函数
const searchPOI = async () => {
  if (!keyword.value) return;

  try {
    // queryType = 4 普通建议词搜索
    const apiUrl = `https://api.tianditu.gov.cn/v2/search?postStr={"keyWord":"${keyword.value}","level":12,"mapBound":"116.18198,39.84396,116.5799,40.00327","queryType":4,"start":0,"count":100}&type=query&tk=${apiKey}`;
    const response = await axios.get(apiUrl);
    if (response.data.status !== null) {
        if(response.data.suggests){
            searchResults.value = response.data.suggests;
        }
        else{
            alert('无法找到该地址')
        }
    } else {
        console.error('搜索失败:', response.data.msg);
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
};

</script>

<style scoped>
.search-container{
    position: absolute;
    left: 100px;
    top: 80px;
}
.search-box {
    display: flex;
    height: 40px;
    width: 300px;
    
    background-color: white;
    /* background-color: rgb(254, 34, 34); */
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    padding: 5px;
    z-index: 9999; /* 设置一个较大的 z-index 值 */
}

.search-box input {
    flex:1;
    border: none;
    outline: none;
    font-size: 16px;
    color: black;
}
.search-box button {
    border: none;
    outline: none;
    font-size: 16px;
  
}
.search-box button:hover {
    cursor: pointer;
}
ul{
    /* height: 400px; */
    width: 300px;
    padding-left: 0;
    list-style-type: none;
    margin-top: 3px;
    border: 1px solid grey;
    border-top: none;
    /* overflow:scroll; */
    background: rgba(255,255,255,70);
}
li{
    padding-left: 10px;
    border-bottom: 1px solid grey;
}
</style>