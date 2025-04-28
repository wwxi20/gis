<template>
    <div class="container">
        <div id="mapDom" class="map"></div>
        <search :map="map" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import Search from './search.vue';


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
});
</script>

<style scoped>
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
</style>