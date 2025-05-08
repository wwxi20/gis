<template>
<div class="tool-box">
<button @click="resetCenter(map)">复位</button>
<button @click="addOverviewMap">地图鹰眼</button>

</div>
</template>

<script setup>
import { resetCenter } from './ResetCenter';
import {createOverview} from './Overview'


const props = defineProps({
    map: {
        type: Object,
        required: true
    }
});

const addOverviewMap = () => {
    if (props.map) {
        setTimeout(() => {
            createOverview(props.map);
        }, 100); // 延迟 100 毫秒
    } else {
        console.error('地图对象无效');
    }
};
</script>

<style scoped>
.tool-box{
    width: 200px;
    height: 150px;
    position: absolute;
    bottom: 100px;
    right: 50px;
    background-color: pink;
}
button{
    cursor: pointer;
}
</style>