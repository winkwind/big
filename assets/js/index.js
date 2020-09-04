$(function () {
    // 获取用户信息
    $.ajax({
        type: 'get',
        url: '/my/userinfo',

        success(res) {
            getUser_info(res);
        }
    })
    // 退出
    let layer = layui.layer;
    $("#leave").on('click', (e) => {
        e.preventDefault();
        layer.confirm('确定退出？？', {
            icon: 3, title: '提示'
        }, function () {
            // 确定退出清空登录码
            localStorage.removeItem('token')
            // 返回登录界面
            location.href = '/login.html'
        })
    })

})
function getUser_info(res) {
    if (res.status === 0) {
        // 渲染用户信息
        // 名字
        $("#welcome").html(`欢迎\&nbsp;\&nbsp;${res.data.nickname || res.data.username}`)
        // 头像
        if (res.data.user_pic === null) {
            $(".text-avatar").html((res.data.nickname || res.data.username)[0].toUpperCase())
            $(".text-avatar").show();
            $(".layui-nav-img").hide();
        }
        else {
            $(".text-avatar").hide();
            $(".layui-nav-img").show().prop('src', res.data.user_pic);
        }

    }
}