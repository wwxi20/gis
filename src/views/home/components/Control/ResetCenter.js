const ResetCenter = function (map){
    const point = [12758612.973162018, 3562849.0216611675];
    // props.map.getView().setCenter(point);
    map.getView().setCenter(point);
    map.getView().setZoom(17.5);

}

export {ResetCenter}