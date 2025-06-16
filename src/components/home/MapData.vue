<template>
    <div class="container">
        <div id="mapDom" class="map"></div>
        <!-- 使用 LayerSelector 子组件 -->
        <LayerSelector :map="map" :initialVisibility="layerVisibility" @layerVisibilityChanged="updateLayerVisibility" />
        <search :map="map" />
        <ToolBox v-if="map" :map="map" />
        <Mark v-if="map" :map="map" />
        <Measure v-if="map" :map="map" />
        <Profile v-if="map" :map="map"/>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import Search from './Control/Search.vue';
import ToolBox from './Control/ToolBox.vue';
import Mark from './Control/Mark.vue';
import Measure from './Control/Measure.vue';
import { ScaleLine } from 'ol/control';
import LayerSelector from './Control/LayerSelector.vue'; // 引入子组件
import Profile from './Control/Profile.vue';

const props = defineProps({
    viewConf: { default: () => ({}) },
    defLyrs: { default: () => ['vec_c', 'cva_c'] }
});

const map = ref(null);

// 图层管理，存储图层可见性状态
const layerVisibility = ref({
    vec_c: true,
    img_c: false,
    cva_c: true
});

onMounted(() => {
    const viewOpts = Object.assign({
        projection: 'EPSG:3857',
        center: [12758612.973162018, 3562849.0216611675],
        zoom: 17.5,
        maxZoom: 18.5
    }, props.viewConf);

    const layerOptions = [
        { key: 'img_c', title: '天地图影像', option: { projection: 'EPSG:4326', url: `http://t{0-7}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${cxApp.tianKey}` } },
        { key: 'vec_c', title: '天地图', option: { projection: 'EPSG:4326', url: `http://t{0-7}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${cxApp.tianKey}` } },
        { key: 'cva_c', title: '天地图注记', option: { projection: 'EPSG:4326', url: `http://t{0-7}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${cxApp.tianKey}` } },
    ];
    map.value = new Map({
        target: 'mapDom',
        view: new View(viewOpts),
        layers: layerOptions.map(item => {
            const layer = new TileLayer({
                properties: {
                    name: item.key,
                    title: item.title
                },
                source: new XYZ(item.option),
                visible: layerVisibility.value[item.key]
            });
            return layer;
        })
    });

    const scaleLine = new ScaleLine({
        bar: true,
        text: true
    });
    map.value.addControl(scaleLine);
});

// 更新图层可见性状态的方法
const updateLayerVisibility = (newVisibility) => {
    layerVisibility.value = { ...newVisibility };
};
</script>
<style >
.container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
}

.map {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
.ol-scale-bar{
    padding-left:10px;
    padding-top: 15px;
    padding-right: 25px;
    position: absolute;
    left: 20px;
    bottom: 80px;
    background-color: rgba(232, 234, 236, 0.3)
}

/* 比例尺 */
.ol-scale-line {
    background: rgba(255, 255, 255, 0.8); /* 设置比例尺条的背景色 */
    border-radius: 4px; /* 设置圆角 */
    bottom: 10px; /* 距离地图底部的距离 */
    left: 10px; /* 距离地图左侧的距离 */
    display: flex;
    padding: 2px; /* 内边距 */
}
.ol-scale-bar-inner {
    display: flex;
    align-items: center;
    /* background-color: white; */
}

.ol-scale-text {
    display: none;
}

.ol-scale-step-marker {
    display: none;
}

.ol-scale-singlebar {
    height: 6px;
}

.ol-scale-singlebar-odd {
    background-color: #000;
}

.ol-scale-singlebar-even {
    background-color: #fff;
    position: relative;
    top: -10px;
}
.ol-scale-step-text {
    color: #000; /* 刻度数字的颜色 */
    font-size: 10px; /* 字体大小 */
    /* position: relative;
    top: 2px;
    right: 10px */
}

/* 放大缩小 */
.ol-overlaycontainer{
    position: relative;

}
.ol-zoom{
    position: absolute;
    top: 35px;
    left: 141px;
}
.ol-zoom button{
    border: none;
    background-color: white;
    margin-right: 10px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

/* 旋转 */
.ol-rotate{
    position: absolute;
    top: 36px;
    left: 95px;
}
.ol-rotate button{
    border: none;
    background-color: white;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

</style>