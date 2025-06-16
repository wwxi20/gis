<template>
    <div class="layer-selector">
        <label>
            <input type="checkbox" v-model="layerVisibility.vec_c" @change="toggleLayer('vec_c')"> 矢量图层
        </label>
        <label>
            <input type="checkbox" v-model="layerVisibility.img_c" @change="toggleLayer('img_c')"> 卫星影像图层
        </label>
        <label>
            <input type="checkbox" v-model="layerVisibility.cva_c" @change="toggleLayer('cva_c')"> 文字注记
        </label>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// 接收父组件传递的地图对象和初始图层可见性状态
const props = defineProps({
    map: {
        type: Object,
        required: true
    },
    initialVisibility: {
        type: Object,
        default: () => ({
            vec_c: true,
            img_c: false,
            cva_c: true
        })
    }
});

// 定义一个用于触发事件的函数
const emits = defineEmits(['layerVisibilityChanged']);

// 存储图层可见性状态
const layerVisibility = ref({ ...props.initialVisibility });

// 切换图层可见性的方法
const toggleLayer = (layerKey) => {
    const layers = props.map.getLayers().getArray();
    const layer = layers.find(l => l.get('name') === layerKey);
    if (layer) {
        layer.setVisible(layerVisibility.value[layerKey]);
    }
    // 触发事件通知父组件图层可见性已改变
    emits('layerVisibilityChanged', layerVisibility.value);
};
</script>

<style scoped>
.layer-selector {
    position: absolute;
    bottom: 35px;
    right: 65px;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>