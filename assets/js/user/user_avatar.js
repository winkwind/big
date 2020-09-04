$(function () {
    // 1.1 配置选项
    const options = {
        // 纵横比  
        aspectRatio: 1,
        // 指定预览区域  
        preview: '.img-preview'
    }
    // 1.2 创建裁剪区域
    $('#image').cropper(options)

    // 上传按钮点击事件
    $("#upload").on('click', () => {
        $("#upfile").click();
    })
    // 更换裁剪图片
    // 给文件选择框添加change事件
    $("#upfile").on('change', e => {
        // 长度为零即没选文件
        if (e.target.files.length === 0) {
            return layui.layer.msg('选照片！')
        }
        let imgURL = URL.createObjectURL(e.target.files[0]);
        // 销毁旧的裁剪区域，重新设置图片路径，重新初始化裁剪区域
        $("#image").cropper('destroy').attr('src', imgURL).cropper(options)

    })
    // 上传头像
    $("#upsure").on('click', function () {
        // 1. 要拿到用户裁剪之后的头像
        let dataURL = $("#image").cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
            // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        }).toDataURL('image/png');

        // 上传
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('上传失败！')
                }
                layui.layer.msg(res.message)
                // 重新渲染
                $.ajax({
                    type: 'get',
                    url: '/my/userinfo',

                    success(res) {
                        parent.getUser_info(res);
                    }
                })
            }
        })






    })




})