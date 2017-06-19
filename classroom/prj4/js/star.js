/**
 * Created by Rocky-Wang on 2017/3/1.
 */
/**
 * 鼠标移入时显示星星级别，并且点亮前序所有星星
 * 当鼠标点击后，记录星星状态，再鼠标移出后，只要用户不点击，将恢复记录状态
 * */
$(document).ready(function () {
    // 静态信息区
    var unStarPath = './images/star_hollow_hover@2x.png';
    var enStarPath = './images/star_onmouseover@2x.png';
    var sMessage = ['很差','较差','还行','推荐','力荐'];

    // 定位信息区
    var $StarDomain = $('#voteStar');
    var $StarArr = $StarDomain.children('a');
    var $info = $StarDomain.next('span');

    // 当前状态存储标记
    var currentPos = -1;

    $StarArr.mouseover(function () {
        var pos = $(this).index();

        // 遍历每个星星的状态
        $StarArr.each(function (index,elem) {
            var $img = $(elem).children('img');
            if (index > pos){
                $img.attr('src',unStarPath);
            }
            else {
                $img.attr('src',enStarPath);
            }
        });
        // 更新状态值信息
        $info.text(sMessage[pos]);
    });

    $StarArr.click(function () {
        var pos = $(this).index();

        currentPos = pos;
    });

    $StarArr.mouseout(function () {
        // 遍历每个星星的状态
         $StarArr.each(function (index,elem) {
             var $img = $(elem).children('img');

             if (index > currentPos){
                 $img.attr('src',unStarPath);
             }
             else {
                 $img.attr('src',enStarPath);
             }
         });

        // 根据存储状态进行状态值的显示
         if (currentPos == -1){
             $info.text(' ');
         }
         else {
             $info.text(sMessage[currentPos]);
         }
    });
});