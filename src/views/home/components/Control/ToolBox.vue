<template>
<div class="tool-box">
<button @click="ResetCenter(map)">复位</button>
<button @click="onScaleChange(map )">比例尺线</button>
<button @click="onScaleChange(map , 'bar')">比例尺条</button>

</div>
</template>

<script setup>
import { ResetCenter } from './ResetCenter';
import { onScaleChange } from './ScaleLine';

const props = defineProps({
    map: {
        type: Object,
        required: true
    }
});
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
/* 确保比例尺条有合适的样式 */
.ol-scale-bar {
    background: rgba(0, 60, 136, 0.3);
    border-radius: 4px;
    bottom: 8px;
    left: 8px;
    padding: 2px;
    position: absolute;
}

.ol-scale-step-marker {
    background-color: #fff;
    border: 1px solid #000;
    height: 15px;
}

.ol-scale-step-text {
    color: #fff;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
}

.ol-scale-text {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    bottom: 30px;
    color: #000;
    left: 8px;
    padding: 2px;
    position: absolute;
}
</style>