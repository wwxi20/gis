<template>
    <div class="search-container">
        <div class="search-box">
            <input type="text" v-model="keyword" placeholder="输入关键字搜索">
            <button @click="searchPOI">搜索</button>
        </div>
        <ul v-show="searchResults.length > 0">
            <li v-for="(result, index) in searchResults" :key="index" @click="jumpToLocation(result)">
                {{ result.name }} - {{ result.address }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import proj4 from 'proj4'; // 坐标转换

// 定义 EPSG:4326 和 EPSG:3857 的投影定义
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');

// 接收父组件传递的地图实例
const props = defineProps({
    map: {
        type: Object,
        required: true
    }
});

// 定义响应式数据
const keyword = ref('');
const searchResults = ref([]);

// 天地图 API 密钥
const apiKey = 'e2d035db12beacb76df2c1efc7ec03ab';

// 修改全局变量为数组，存储所有历史标记层
let markerLayers = [];

// 清除所有标记层
const clearAllMarkers = () => {
    markerLayers.forEach(layer => {
        props.map.removeLayer(layer);
        layer.getSource().clear();
    });
  markerLayers = [];
};

const defaultPointStyle = new Style({
        image: new Circle({
            radius: 8, // 点的半径，可调整大小
            fill: new Fill({
                color: 'blue' // 点的填充颜色，可自定义
            }),
            stroke: new Stroke({
                color: 'white', // 点的边框颜色
                width: 2 // 点的边框宽度
            })
        })
    });
// 添加标记到地图
const addMarkers = (pois) => {
    // 确保 features 初始为空
    let features = [];
    features = pois.map((poi) => {
        const [lon, lat] = poi.lonlat.split(',');
        const point = [Number(lon), Number(lat)];

        // 进行坐标转换
        const convertedPoint = proj4('EPSG:4326', 'EPSG:3857', point);
        
        const feature = new Feature({
            geometry: new Point(convertedPoint),
            poiData: poi 
        });
        // 为每个特征应用样式
        feature.setStyle(defaultPointStyle);
        return feature;
    });

    const vectorSource = new VectorSource({
        features: features
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource
    });
    markerLayers.push(vectorLayer);
    props.map.addLayer(vectorLayer);
};

// 定义选中点的样式
const selectedPointStyle = new Style({
    image: new Circle({
        radius: 12, // 选中点的半径更大
        fill: new Fill({
            color: 'red' // 选中点的填充颜色为红色
        }),
        stroke: new Stroke({
            color: 'white', // 选中点的边框颜色为黄色
            width: 3 // 选中点的边框宽度更宽
        })
    })
});

// 点击列表项时地图中心跳转到对应位置
const jumpToLocation = (result) => {
    // 提取经纬度
    const [lon, lat] = result.lonlat.split(',');
    const point = [Number(lon), Number(lat)];
    // 进行坐标转换
    const convertedPoint = proj4('EPSG:4326', 'EPSG:3857', point);
    props.map.getView().setCenter(convertedPoint);

    // 恢复所有点的默认样式
    markerLayers.forEach(layer => {
        layer.getSource().getFeatures().forEach(feature => {
            feature.setStyle(defaultPointStyle);
        });
    });
    // 找到对应点并改变样式
    markerLayers.forEach(layer => {
        layer.getSource().getFeatures().forEach(feature => {
            if (feature.get('poiData') === result) {
                feature.setStyle(selectedPointStyle);
            }
        });
    });


};

// 搜索函数
const searchPOI = async () => {
    // 添加请求锁
    let isSearching = false;
    if (!keyword.value || isSearching) return;

    try {
        clearAllMarkers(); // 在搜索前清除所有标记层
        // queryType = 4 普通建议词搜索
        const apiUrl = `https://api.tianditu.gov.cn/v2/search?postStr={"keyWord":"${keyword.value}","level":12,"mapBound":"113.39,29.58,115.10,31.22","queryType":4,"start":0,"count":100}&type=query&tk=${apiKey}`;
        const response = await axios.get(apiUrl);
        if (response.data.status !== null) {
            if (response.data.suggests) {
                searchResults.value = response.data.suggests;
                addMarkers(searchResults.value);
                jumpToLocation(searchResults.value[0])
            } else {
                alert('无法找到该地址');
            }
        } else {
            console.error('搜索失败:', response.data.msg);
        }
    } catch (error) {
        console.error('请求出错:', error);
    } finally {
        isSearching = false;
    }
};
</script>    

<style scoped>
.search-container {
    position: absolute;
    left: 80px;
    top: 80px;
}

.search-box {
    display: flex;
    height: 40px;
    width: 300px;
    background-color: white;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    padding: 5px;
    z-index: 9999;
}

.search-box input {
    flex: 1;
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

ul {
    width: 300px;
    padding-left: 0;
    list-style-type: none;
    margin-top: 3px;
    /* border: 1px solid grey; */
    border-top: none;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
}

li {
    padding-left: 10px;
    border-bottom: .5px solid grey;
}
</style>