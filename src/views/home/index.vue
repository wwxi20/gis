<script setup>
import MapData from '../../components/home/MapData.vue';

</script>


<template>
<MapData />
<!-- <RouterLink to="/navigate">
    <button class="navi-button">导航服务</button>
</RouterLink> -->

</template>

<style scoped>
.navi-button{
    display: block;
    padding: 8px 16px;
    font-size: 14px;
    width: 95px;
    border: none;
    position: relative;
    top: 77px;
    right: 417px;
    background-color: white;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    
}
.navi-button:hover {
    color: #5bb5f1;
}
</style>