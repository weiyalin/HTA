document.addEventListener('plusready', addMainBackListener);
var scan = null;            //扫码控件
var inspType = null;

/**
 * 拼接完整路由
 * @param url
 * @returns {string}
 */
function getUrl(url) {
    return 'http://www.iotshifang.com/' + url + '?jsonp=?';
}

/**
 * 检测滚动条位置
 */
function check(){
    let myScr = $("#myScr");
    let time = 50;
    let check = setInterval(function () {
        time+=time;
        if(time >= 300){
            clearTimeout(check);
        }else if(myScr.scrollTop() > 0){
            myScr.animate({ scrollTop: 0}, 100);
            clearTimeout(check);
        }
    },time);
}

/**
 * 监听手机返回按键
 */
function addMainBackListener(){
    var first = null;
    plus.key.addEventListener("backbutton",function () {
        //首次按键，提示‘再按一次退出应用’
        if (!first) {
            first = new Date().getTime();
            plus.nativeUI.toast( "再按一次退出应用");
            setTimeout(function() {
                first = null;
            }, 1000);
        } else {
            if (new Date().getTime() - first < 1000) {
                plus.runtime.quit();
            }
        }
    });
}