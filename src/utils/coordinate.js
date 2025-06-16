import proj4 from 'proj4'; // 坐标转换

// 定义 EPSG:4326 和 EPSG:3857 的投影定义
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');


const Coordinate = function (org, aim,  point ){
    const convertedPoint = proj4(org, aim, point);
    return convertedPoint
}
const CoordinateTo4326 = function ( point ){
    const convertedPoint = proj4('EPSG:3857', 'EPSG:4326', point);
    return convertedPoint
}
export default Coordinate;