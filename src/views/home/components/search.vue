<template>
    <div class="search-box">    
    <input type="text" placeholder="输入关键字搜索">
    <button @click="searchPOI">搜索</button>
    </div>
</template>

<script setup>

</script>

<style>
.search-box {
    display: flex;
    height: 40px;
    width: 300px;
    position: absolute;
    left: 100px;
    top: 80px;
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
</style>