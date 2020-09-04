$(function () {
    let form = layui.form;
    let layer = layui.layer;
    // 密码效验规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        newPwd: function (value) {
            if (value === $("#oldPwd").val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $("#newPwd").val()) {
                return '两次密码不一致！'

            }
        }
    })
    // 提交表单
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('失败哒')
                }
                layer.msg('成功');
                // 重置表单
                console.log($('.layui-form')[0]);
                // document.querySelector('#form1').reset();
                $('.layui-form')[0].reset()
            }
        })
    })



















})