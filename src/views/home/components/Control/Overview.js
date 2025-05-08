// Overview.js
import OverviewMap from 'ol/control/OverviewMap.js';
import TileLayer from 'ol/layer/Tile.js';

const createOverview = map =>
{
  // 获取主地图
  const baseLayer = map.getLayers().item(0)

  // 创建鹰眼控件
  const miniMap = new OverviewMap({
    collapsed: false,
    layers: [new TileLayer({ source: baseLayer.getSource() })]
  })

  // 控件添加到地图
  map.addControl(miniMap)
}



export { createOverview };