<template>
    <div class="measure-controls">
        <div class="button-switch">
        <button @click="toggleMeasureButtons">{{ showMeasureButtons ? '测量 收起' : '测量 展开' }}</button>
        
        </div>
        <div v-if="showMeasureButtons" class="sub-buttons">
            <button @click="startMeasurement('distance')">距离测量</button>
            <button @click="startMeasurement('area')">面积测量</button>
            <button @click="clearAll()">清除</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Feature } from 'ol';
import { LineString, Polygon } from 'ol/geom';
import { Style, Stroke, Fill, Text } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { getArea, getLength } from 'ol/sphere';

const showMeasureButtons = ref(false);

const toggleMeasureButtons = () => {
    showMeasureButtons.value = !showMeasureButtons.value;
};

// 接收父组件传递的地图实例
const props = defineProps({
    map: {
        type: Object,
        required: true
    }
});

// 当前测量类型，distance 或 area
const currentMeasurementType = ref('');
// 存储测量的坐标
const measurementCoordinates = ref([]);
// 创建矢量数据源
const measurementSource = new VectorSource();
// 创建矢量图层
const measurementLayer = new VectorLayer({
    source: measurementSource,
    style: function (feature) {
        const geometryType = feature.getGeometry().getType();
        if (geometryType === 'LineString') {
            return new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 2
                }),
                text: new Text({
                    text: feature.get('lengthText'),
                    fill: new Fill({ color: 'red' }),
                    offsetY: -10
                })
            });
        } else if (geometryType === 'Polygon') {
            return new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(255, 0, 0, 0.2)'
                }),
                text: new Text({
                    text: feature.get('areaText'),
                    fill: new Fill({ color: 'red' }),
                    offsetY: -10
                })
            });
        }
    }
});

const formatLength = (line) => {
    const length = getLength(line);
    let output;
    if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
};

const formatArea = (polygon) => {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km²';
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm²';
    }
    return output;
};

onMounted(() => {
    if (props.map) {
        // 将矢量图层添加到地图
        props.map.addLayer(measurementLayer);

        // 监听地图的点击事件
        props.map.on('click', (event) => {
            if (event.originalEvent.button === 0) { // 左键点击
                const coordinate = event.coordinate;
                if (currentMeasurementType.value === 'distance' || currentMeasurementType.value === 'area') {
                    measurementCoordinates.value.push(coordinate);
                    if (currentMeasurementType.value === 'distance' && measurementCoordinates.value.length >= 2) {
                        const line = new LineString(measurementCoordinates.value);
                        const lengthText = formatLength(line);
                        const lineFeature = new Feature({
                            geometry: line,
                            lengthText: lengthText
                        });
                        measurementSource.clear();
                        measurementSource.addFeature(lineFeature);
                    } else if (currentMeasurementType.value === 'area' && measurementCoordinates.value.length >= 3) {
                        const polygon = new Polygon([measurementCoordinates.value]);
                        const areaText = formatArea(polygon);
                        const polygonFeature = new Feature({
                            geometry: polygon,
                            areaText: areaText
                        });
                        measurementSource.clear();
                        measurementSource.addFeature(polygonFeature);
                    }
                }
            }
        });

        // 监听地图的双击事件，结束绘制
        props.map.on('dblclick', (event) => {
            if (currentMeasurementType.value === 'distance' || currentMeasurementType.value === 'area') {
                currentMeasurementType.value = '';
                measurementCoordinates.value = [];
            }
        });
    }
});

const startMeasurement = (type) => {
    currentMeasurementType.value = type;
    measurementCoordinates.value = [];
    measurementSource.clear();
};

const clearAll = () => {
    // currentMeasurementType.value = type;
    measurementCoordinates.value = [];
    measurementSource.clear();
};
</script>

<style scoped>
.measure-controls {
    position: absolute;
    top: 80px;
    right: 210px;
    z-index: 1000;
}

.measure-controls button {
    display: block;
    padding: 8px 16px;
    font-size: 14px;
    border: none;
    background-color: white;
    cursor: pointer;
}
.measure-controls button:hover {
    color: #5bb5f1;
}

.button-switch button{
    margin-bottom: 8px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
}

.sub-buttons button {
    width: 88px;
    box-shadow: 0px 0px ;
    margin-bottom: 0;
}
</style>