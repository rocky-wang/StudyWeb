/**
 * Created by Rocky-Wang on 2017/5/8.
 */
/**
 * @description 将红绿蓝3种十进制颜色转化为16进制字符串
 * 1<<24的目的是保证1+24位的空间，然后通过截取掉最高位保证返回值一定是8个16进制字符
 * */
function rgb2Hex(r, g, b) {
    return "#" + ((1<<24) | (r<<16) | (g<<8) | b )
            .toString(16)
            .substr(1);
}

/**
 * @description 获取对象类型的字符串
 * 根据传递的对象，反馈对象的类型值，比如array,object,function
 * */
var toStr = Object.prototype.toString;
function getType(o) {
    return toStr.call(o).slice(8,-1);
}

/**
 * @description 获取数字+英文字母的随机码，未完成
 * */
function getRandCode() {
    return Math.random()*Math.pow(36,4) << 0;
}
