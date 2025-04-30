<template>
    <div class="marker-controls">
        <div class="button-swich">
        <button @click="toggleMarkingButtons">{{ showMarkingButtons ? '标记 收起' : '标记 展开' }}</button>
        </div>
        <div v-if="showMarkingButtons" class="sub-buttons">
            <button @click="startMarkerType('point')">标记点</button>
            <button @click="startMarkerType('line')">标记折线</button>
            <button @click="clearMarkers">清除标记</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Feature } from 'ol';
import { Point, LineString, Polygon } from 'ol/geom';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import axios from 'axios';
import proj4 from 'proj4'; // 坐标转换

// 定义 EPSG:4326 和 EPSG:3857 的投影定义
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');

const showMarkingButtons = ref(false);

const toggleMarkingButtons = () => {
    showMarkingButtons.value = !showMarkingButtons.value;
};


// 接收父组件传递的地图实例
const props = defineProps({
    map: {
        type: Object,
        required: true
    }
});

// 当前标记类型，point 或 line
const currentMarkerType = ref('');
// 存储折线的坐标
const lineCoordinates = ref([]);
// 创建矢量数据源
const markerSource = new VectorSource();
// 创建矢量图层
const markerLayer = new VectorLayer({
    source: markerSource,
    style: function (feature) {
        const geometryType = feature.getGeometry().getType();
        if (geometryType === 'Point') {
            const pointInfo = feature.get('pointInfo') || '获取信息中...';
            return new Style({
                image: new Circle({
                    radius: 8,
                    fill: new Fill({
                        color: 'blue'
                    }),
                    stroke: new Stroke({
                        color: 'white',
                        width: 2
                    })
                }),
                text: new Text({
                    text: pointInfo,
                    offsetY: -15,
                    fill: new Fill({
                        color: 'black'
                    })
                })
            });
        } else if (geometryType === 'LineString') {
            return new Style({
                stroke: new Stroke({
                    color: 'green',
                    width: 2
                })
            });
        } else if (geometryType === 'Polygon') {
            return new Style({
                stroke: new Stroke({
                    color: 'green',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(0, 255, 0, 0.3)'
                })
            });
        }
    }
});

// 天地图逆地理编码服务 URL
const tianDiTuReverseGeocodeUrl = 'http://api.tianditu.gov.cn/geocoder';
// key
const tianDiTuKey = 'e2d035db12beacb76df2c1efc7ec03ab';

const getAddressFromCoordinates = async (coordinates) => {
    try {
        const [org_lon, org_lat] = coordinates;
        // 进行坐标转换
        const convertedPoint = proj4( 'EPSG:3857','EPSG:4326', [org_lon, org_lat]);
        const [lon, lat] = convertedPoint;
        // console.log(lon,lat)
        const params = {
            postStr: JSON.stringify({
                lon: lon,
                lat: lat,
                ver: 1
            }),
            type: 'geocode',
            tk: tianDiTuKey
        };
        const response = await axios.get(tianDiTuReverseGeocodeUrl, { params });
        const result = response.data;
        if (result.msg == "ok") {
            return result.result.formatted_address;
        } else {
            return '地址信息获取失败';
        }
    } catch (error) {
        console.error('获取地址信息失败:', error);
        return '地址信息获取失败';
    }
};

onMounted(() => {
    if (props.map) {
        // 将矢量图层添加到地图
        props.map.addLayer(markerLayer);

        // 监听地图的点击事件
        props.map.on('click', async (event) => {
            if (event.originalEvent.button === 0) { // 左键点击
                const coordinate = event.coordinate;
                if (currentMarkerType.value === 'point') {
                    const marker = new Feature({
                        geometry: new Point(coordinate)
                    });
                    markerSource.addFeature(marker);

                    const address = await getAddressFromCoordinates(coordinate);
                    marker.set('pointInfo', address);
                    markerSource.changed();
                } else if (currentMarkerType.value === 'line') {
                    lineCoordinates.value.push(coordinate);
                    if (lineCoordinates.value.length >= 2) {
                        const lineFeature = new Feature({
                            geometry: new LineString(lineCoordinates.value)
                        });
                        markerSource.addFeature(lineFeature);
                    }
                }
            }
        });

        // 监听地图的右键点击事件
        props.map.on('pointerdown', (event) => {
            if (event.originalEvent.button === 2) { // 右键点击
                if (currentMarkerType.value === 'point') {
                    currentMarkerType.value = '';
                } else if (currentMarkerType.value === 'line') {
                    currentMarkerType.value = '';
                    lineCoordinates.value = [];
                }
            }
        });

        // 监听地图的双击事件来闭合多边形
        props.map.on('dblclick', (event) => {
            if (currentMarkerType.value === 'line' && lineCoordinates.value.length >= 3) {
                // 检查最后一个点和第一个点是否接近（判断是否闭合）
                const startPoint = lineCoordinates.value[0];
                const endPoint = event.coordinate;
                const distanceThreshold = 10; // 距离阈值，可调整
                const dx = startPoint[0] - endPoint[0];
                const dy = startPoint[1] - endPoint[1];
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < distanceThreshold) {
                    lineCoordinates.value.push(startPoint);
                    const polygonFeature = new Feature({
                        geometry: new Polygon([lineCoordinates.value])
                    });
                    markerSource.addFeature(polygonFeature);
                    lineCoordinates.value = [];
                }
            }
        });
    }
});

const startMarkerType = (type) => {
    currentMarkerType.value = type;
    if (type === 'line') {
        lineCoordinates.value = [];
        markerSource.clear();
    } else if (type === 'point') {
        markerSource.clear();
    }
};

const clearMarkers = () => {
    markerSource.clear();
    lineCoordinates.value = [];
    currentMarkerType.value = '';
};
</script>

<style scoped>
.marker-controls {
    position: absolute;
    top: 80px;
    right: 100px;
    z-index: 1000;
}

.marker-controls button {
    display: block;
    padding: 8px 16px;
    font-size: 14px;
    border: none;
    background-color: white;
    cursor: pointer;
}
.marker-controls button:hover {
    color: #5bb5f1;
}

.button-swich button{
    margin-bottom: 8px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
}

.sub-buttons button {
    width: 88px;
    box-shadow: 0px 0px ;
    margin-bottom: 0;
}

</style>