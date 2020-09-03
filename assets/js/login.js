window.addEventListener('load', function () {
    const link_reg = document.querySelector('#link_reg');
    const link_login = document.querySelector('#link_login');
    const login_box = document.querySelector('.login-box');
    const reg_box = document.querySelector('.reg-box');
    // 切换登录注册
    link_reg.addEventListener('click', function () {
        reg_box.style.display = 'block';
        login_box.style.display = 'none';
    })
    link_login.addEventListener('click', function () {
        reg_box.style.display = 'none';
        login_box.style.display = 'block';
    })
    // 表单验证
    let form = layui.form;//导入表单模块
    let layer = layui.layer;//导入弹出模块
    form.verify({
        // 密码验证
        psw: [/^[\w]{6,12}$/, '密码6-12位'],
        // 确认密码验证
        confirm: function (value) {
            if (value !== $("#psw").val()) {
                return '两次输入不一致'
            }
        }
    })
    // 提交注册表单
    $("#reg").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/reguser',
            type: 'post',
            data: $("#reg").serialize(),
            success(res) {
                console.log(res);
                // 弹出提示
                layer.msg(res.message)
                if (res.status == 0) {
                    setTimeout(function () {
                        return link_login.click();
                    }, 2000)
                }
            }
        })
    })
    // 提交登录表单
    $("#login").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            type: 'post',
            data: $("#login").serialize(),
            success(res) {
                res.token
                // 弹出提示
                layer.msg(res.message)
                console.log(res);
                if (res.status == 0) {
                    // 将唯一标识符存储
                    localStorage.setItem('token', res.token)
                    setTimeout(() => {
                        location.href = '/index.html'

                    }, 500)
                }
            }
        })
    })





























})