$(function () {

    let form = layui.form;
    let layer = layui.layer;
    // 表单验证
    form.verify({
        nickname: function (value, item) {
            //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        }
    })
    // 取值填充
    function reset() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success(res) {
                if (res.status !== 0) {
                    layer.msg('获取数据失败')
                }
                form.val('user_form', res.data)

            }
        })
    }
    reset();
    // 重置
    $("#reset").on('click', function () {
        reset();
    })
    // 提交资料
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('提交失败')
                }
                layer.msg('提交成功');
                $.ajax({
                    type: 'get',
                    url: '/my/userinfo',
                    success(res) {
                        if (res.status !== 0) {
                            layer.msg('获取数据失败')
                        }
                        window.parent.getUser_info(res);

                    }
                })
            }
        })
    })
















})