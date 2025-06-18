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
import { onMounted, ref, onUnmounted } from 'vue';
import { Feature } from 'ol';
import { LineString, Polygon, Point } from 'ol/geom';
import { Style, Stroke, Fill, Text, Circle as CircleStyle } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { getArea, getLength } from 'ol/sphere';
import { Modify } from 'ol/interaction';
import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay';

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
                    color: 'blue',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.2)'
                }),
                text: new Text({
                    text: feature.get('areaText'),
                    fill: new Fill({ color: 'red' }),
                    offsetY: -10
                })
            });
        } else if (geometryType === 'Point') {
            // 点的样式
            return new Style({
                image: new CircleStyle({
                    radius: 6,
                    fill: new Fill({
                        color: 'red'
                    }),
                    stroke: new Stroke({
                        color: 'white',
                        width: 2
                    })
                }),
                text: new Text({
                    text: feature.get('pointText'),
                    offsetY: -15,
                    offsetX: 10,
                    fill: new Fill({
                        color: 'black'
                    }),
                    stroke: new Stroke({
                        color: 'white',
                        width: 2
                    })
                })
            });
        }
    }
});

// 创建修改交互，允许拖拽点
const modify = new Modify({
    source: measurementSource
});

// 鼠标移动时的临时线段
const tempLineSource = new VectorSource();
const tempLineLayer = new VectorLayer({
    source: tempLineSource,
    style: new Style({
        stroke: new Stroke({
            color: 'rgba(255, 0, 0, 0.5)',
            width: 2,
            lineDash: [5, 5]
        })
    })
});

// 存储事件监听器的引用，以便在组件卸载时移除
let moveListener = null;
let clickListener = null;
let dblclickListener = null;

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
        props.map.addLayer(tempLineLayer);
        
        // 添加修改交互，允许拖拽点
        props.map.addInteraction(modify);
        
        // 修改交互的事件监听，当点被拖动时更新测量结果
        modify.on('modifyend', (e) => {
            const features = e.features.getArray();
            if (features.length > 0) {
                const feature = features[0];
                const geometry = feature.getGeometry();
                
                if (geometry instanceof LineString) {
                    const lengthText = formatLength(geometry);
                    feature.set('lengthText', lengthText);
                    
                    // 更新起点和终点标记
                    updateDistanceMarkers(geometry.getCoordinates());
                } else if (geometry instanceof Polygon) {
                    const areaText = formatArea(geometry);
                    feature.set('areaText', areaText);
                }
            }
        });
        
        // 点击事件处理函数
        const handleClick = (event) => {
            if (event.originalEvent.button === 0) { // 左键点击
                const coordinate = event.coordinate;
                if (currentMeasurementType.value === 'distance' || currentMeasurementType.value === 'area') {
                    // 添加坐标点
                    measurementCoordinates.value.push(coordinate);
                    
                    if (currentMeasurementType.value === 'distance') {
                        // 如果是第一个点，添加起点标记
                        if (measurementCoordinates.value.length === 1) {
                            const startPointFeature = new Feature({
                                geometry: new Point(coordinate),
                                pointText: '起点'
                            });
                            measurementSource.addFeature(startPointFeature);
                        }
                        
                        // 如果有两个或更多点，绘制线段
                        if (measurementCoordinates.value.length >= 2) {
                            const line = new LineString(measurementCoordinates.value);
                            const lengthText = formatLength(line);
                            
                            // 查找并移除旧的线段
                            measurementSource.getFeatures().forEach(feature => {
                                if (feature.getGeometry() instanceof LineString) {
                                    measurementSource.removeFeature(feature);
                                }
                            });
                            
                            // 添加新的线段
                            const lineFeature = new Feature({
                                geometry: line,
                                lengthText: lengthText
                            });
                            measurementSource.addFeature(lineFeature);
                        }
                    } else if (currentMeasurementType.value === 'area' && measurementCoordinates.value.length >= 3) {
                        const polygon = new Polygon([measurementCoordinates.value]);
                        const areaText = formatArea(polygon);
                        
                        // 查找并移除旧的多边形
                        measurementSource.getFeatures().forEach(feature => {
                            if (feature.getGeometry() instanceof Polygon) {
                                measurementSource.removeFeature(feature);
                            }
                        });
                        
                        // 添加新的多边形
                        const polygonFeature = new Feature({
                            geometry: polygon,
                            areaText: areaText
                        });
                        measurementSource.addFeature(polygonFeature);
                    }
                }
            }
        };
        
        // 鼠标移动事件处理函数，用于实时显示测量线段
        const handleMouseMove = (event) => {
            if (currentMeasurementType.value === 'distance' && measurementCoordinates.value.length > 0) {
                // 清除临时线段
                tempLineSource.clear();
                
                // 获取最后一个点和当前鼠标位置
                const lastPoint = measurementCoordinates.value[measurementCoordinates.value.length - 1];
                const mousePoint = event.coordinate;
                
                // 创建临时线段
                const tempLine = new LineString([lastPoint, mousePoint]);
                const tempFeature = new Feature({
                    geometry: tempLine
                });
                
                // 添加临时线段到图层
                tempLineSource.addFeature(tempFeature);
            }
        };
        
        // 双击事件处理函数，结束绘制
        const handleDoubleClick = (event) => {
            if (currentMeasurementType.value === 'distance') {
                // 添加终点标记
                const coordinate = event.coordinate;
                const endPointFeature = new Feature({
                    geometry: new Point(coordinate),
                    pointText: '终点'
                });
                measurementSource.addFeature(endPointFeature);
                
                // 更新线段，显示总长度
                const line = new LineString(measurementCoordinates.value);
                const lengthText = formatLength(line);
                
                // 查找并更新线段
                measurementSource.getFeatures().forEach(feature => {
                    if (feature.getGeometry() instanceof LineString) {
                        feature.set('lengthText', `总长: ${lengthText}`);
                    }
                });
                
                // 清除临时线段
                tempLineSource.clear();
                
                // 重置测量状态
                currentMeasurementType.value = '';
            } else if (currentMeasurementType.value === 'area') {
                currentMeasurementType.value = '';
            }
        };
        
        // 注册事件监听器
        clickListener = props.map.on('click', handleClick);
        moveListener = props.map.on('pointermove', handleMouseMove);
        dblclickListener = props.map.on('dblclick', handleDoubleClick);
    }
});

// 更新距离测量的起点和终点标记
const updateDistanceMarkers = (coordinates) => {
    if (coordinates.length < 2) return;
    
    // 查找并更新起点和终点标记
    const features = measurementSource.getFeatures();
    let startPoint = null;
    let endPoint = null;
    
    features.forEach(feature => {
        if (feature.getGeometry() instanceof Point) {
            const pointText = feature.get('pointText');
            if (pointText === '起点') {
                startPoint = feature;
            } else if (pointText === '终点') {
                endPoint = feature;
            }
        }
    });
    
    // 更新起点位置
    if (startPoint) {
        startPoint.getGeometry().setCoordinates(coordinates[0]);
    }
    
    // 更新终点位置
    if (endPoint) {
        endPoint.getGeometry().setCoordinates(coordinates[coordinates.length - 1]);
    }
};

const startMeasurement = (type) => {
    currentMeasurementType.value = type;
    measurementCoordinates.value = [];
    measurementSource.clear();
};

const clearAll = () => {
    // currentMeasurementType.value = type;
    measurementCoordinates.value = [];
    measurementSource.clear();
    tempLineSource.clear();
};

// 组件卸载时清理事件监听器和交互
onUnmounted(() => {
    if (props.map) {
        // 移除事件监听器
        if (clickListener) unByKey(clickListener);
        if (moveListener) unByKey(moveListener);
        if (dblclickListener) unByKey(dblclickListener);
        
        // 移除交互和图层
        props.map.removeInteraction(modify);
        props.map.removeLayer(measurementLayer);
        props.map.removeLayer(tempLineLayer);
        
        // 清理数据源
        measurementSource.clear();
        tempLineSource.clear();
    }
});
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
    border-radius: 4px;
    transition: all 0.3s ease;
}

.measure-controls button:hover {
    color: #5bb5f1;
    background-color: #f5f5f5;
}

.button-switch button{
    margin-bottom: 8px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    font-weight: bold;
}

.sub-buttons {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    padding: 4px;
}

.sub-buttons button {
    width: 88px;
    margin-bottom: 4px;
    border-bottom: 1px solid #f0f0f0;
}

.sub-buttons button:last-child {
    margin-bottom: 0;
    border-bottom: none;
}
</style>