$.ajaxPrefilter(function (option) {
    // 发起请求前进行地址拼接
    option.url = 'http://ajax.frontend.itheima.net' + option.url;
})