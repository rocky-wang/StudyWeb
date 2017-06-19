window.onload = function () {
    // 容器对象
    var oBoxs = document.getElementById('doors');

    // 获取图片NodeList对象集合
    var aImgs = oBoxs.getElementsByTagName('img');

    // 单张图片的宽度
    var nImgWidth = aImgs[0].offsetWidth;

    // 设置门体掩藏的漏出的宽度
    var nExposeWidth = 160;

    // 设置容器的总宽度
    var nBoxWidth = nImgWidth + (aImgs.length - 1)*nExposeWidth;
    oBoxs.style.width = nBoxWidth + 'px';

    // 设置每道门的初始位置
    function setImgPosInit() {
        for (var i = 1,len = aImgs.length; i < len; i++){
            aImgs[i].style.left = nImgWidth + nExposeWidth * (i - 1) + 'px';
        }
    }

    setImgPosInit();

    // 计算每道门打开时应移动的距离
    var nTransDistanceOfDoor = nImgWidth - nExposeWidth;
    // 为每道门绑定事件
    for (var i = 0; i < aImgs.length; i++){
        // 使用立即调用的函数表达式，为了获得不同的i值
        (function (n) {
            aImgs[n].onmouseover = function () {
                // 先将每道门复位
                setImgPosInit();

                // 打开门
                for (var j = 1; j <= n; j++){
                    aImgs[j].style.left = parseInt(aImgs[j].style.left,10) - nTransDistanceOfDoor + 'px';
                }
            }
        })(i);
    }
};
