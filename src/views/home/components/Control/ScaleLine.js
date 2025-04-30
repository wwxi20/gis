import ScaleLine from 'ol/control/ScaleLine.js';
import { Map } from 'ol';
let scale = null;

const onScaleChange = (map) => {
    // if (!map) {
    //     return;
    // }

    // // 移除旧比例尺
    // if (scale) {
    //     map.removeControl(scale);
    //     scale = null;
    // }

    // // 创建新比例尺
    // const scaleOptions = {};
    // if (type === 'bar') {
    //     scaleOptions.bar = true;
    //     scaleOptions.text = false; // 不显示数字
    // }
    // scale = new ScaleLine(scaleOptions);

    // // 添加到地图
    // map.addControl(scale);
    map.addControl(new ScaleLine());
};

export { onScaleChange };