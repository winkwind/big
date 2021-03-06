// option为请求中的配置对象
$.ajaxPrefilter(function (option) {
    // 发起请求前进行地址拼接
    option.url = 'http://ajax.frontend.itheima.net' + option.url;
    // 统一为有权限的页面设置请求头

    if (/\/my\//.test(option.url)) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    option.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 退出并返回登录界面
            localStorage.removeItem('token')
            parent.location.href = '/login.html'


        }
    }


})