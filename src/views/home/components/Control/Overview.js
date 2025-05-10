import { OverviewMap } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

let overviewMapInstance = null;

// 创建鹰眼地图的函数
export const createOverview = (map) => {
    if (overviewMapInstance) return;

    const overviewLayer = new TileLayer({
        source: new XYZ({
            url: 'http://tile.openstreetmap.org/{z}/{x}/{y}.png'
        })
    });

    overviewMapInstance = new OverviewMap({
        layers: [overviewLayer],
        collapsed: false 
    });

    map.addControl(overviewMapInstance);
};

// 移除鹰眼地图的函数
export const removeOverview = (map) => {
    if (overviewMapInstance) {
        map.removeControl(overviewMapInstance);
        overviewMapInstance = null;
    }
};