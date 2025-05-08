<template>
    <div class="container">
        <div id="mapDom" class="map"></div>
        <search :map="map" />
        <ToolBox v-if="map" :map="map" />
        <Mark v-if="map" :map="map" />
        <Measure v-if="map" :map="map" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import Search from './search.vue';
import ToolBox from './Control/ToolBox.vue';
import Mark from './Mark.vue';
import Measure from './Measure.vue';
import { ScaleLine } from 'ol/control';


// 1-定义外部参数
const props = defineProps({
    viewConf: { default: () => ({}) },
    defLyrs: { default: () => ['vec_c', 'cva_c'] }
});

const map = ref(null);

// 3-组件挂载后创建地图
onMounted(() => {
    // 用传入的view配置覆盖默认配置
    const viewOpts = Object.assign({
        projection: 'EPSG:3857',
        center: [12758612.973162018, 3562849.0216611675],
        // center: [114.425212,30.488781],

        zoom: 17.5,
        maxZoom: 18.5
    }, props.viewConf);

    const layerOptions = [
      { key: 'img_c', title: '天地图影像', option: { projection: 'EPSG:4326', url: `http://t{0-7}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${cxApp.tianKey}` } },
      { key: 'vec_c', title: '天地图', option: { projection: 'EPSG:4326', url: `http://t{0-7}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${cxApp.tianKey}` } },
      { key: 'cva_c', title: '天地图注记', option: { projection: 'EPSG:4326', url: `http://t{0-7}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${cxApp.tianKey}` } },
      // { key: 'gaode', title: '瓦片底图', option: { projection: 'EPSG:3857', url: 'http://mapcdn.lshida.com/maps/vt?lyrs=m@292000000&hl=zh-CN&gl=cn&src=app&x={x}&y={y}&z={z}&s=' } }
    ];

    map.value = new Map({
        // 3.1-设置地图的dom容器
        target: 'mapDom',
        // 3.2-设置地图的视图配置，projection默认是EPSG:3857（Web墨卡托平面坐标系）
        view: new View(viewOpts),
        // 3.3-创建显示的图层序列
        layers: layerOptions.filter(item => props.defLyrs.includes(item.key)).map(item => {
            return new TileLayer({
                properties: {
                    name: item.key,
                    title: item.title
                },
                source: new XYZ(item.option)
            });
        })
    });
    // 创建比例尺实例
    const scaleLine = new ScaleLine({
        bar: true, // 显示比例尺条
        text: true // 同时显示数字（可根据需求设置）
    });
    // 将比例尺添加到地图
    map.value.addControl(scaleLine)
});
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
    left: 161px;
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
    left: 115px;
}
.ol-rotate button{
    border: none;
    background-color: white;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

</style>