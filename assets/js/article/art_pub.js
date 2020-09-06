$(function () {
    let layer = layui.layer;
    let form = layui.form;
    // 获取分类
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                let arr = [];
                res.data.forEach(item => {
                    arr.push(`<option value="${item.Id}">${item.name}</option>`)
                });
                $("#cate_id").html(arr.join(''));
                form.render();
            }

        })
    }
    initCate();

    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 裁剪区选择文件
    $("#btn_coverFile").on('click', function () {
        $("#coverFile").click();
    })
    // 文件选择框change事件获取选择的文件
    $("#coverFile").on('change', function () {
        if ($("#coverFile")[0].files.length === 0) {
            return
        };
        // 为裁剪区域重新设置图片
        // 销毁旧的裁剪区域
        // 重新设置图片路径
        // 重新初始化裁剪区域
        $image.cropper('destroy').prop('src', URL.createObjectURL($("#coverFile")[0].files[0])).cropper(options)
        // URL.createObjectURL参数为objenct，返回string的URL。作用： 用于创建对象的URL， 这个新的URL 表示指定的 File 对象或 Blob 对象。
    })

    // 定义一个变量用于记录发布状态
    let art_state = '已发布';
    // 点击存为草稿按钮更改状态
    $("#save").on('click', () => {
        art_state = '草稿';
    })


    // 发布
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        // 获取表单数据  (只能获取到三个)
        let fd = new FormData($(".layui-form")[0]);
        console.log(fd);
        console.log($(".layui-form")[0]);
        // 添加发布状态数据
        fd.append('state', art_state);
        // 添加封面数据
        //将封面裁剪过后的图片，输出为一个文件对象
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 将文件对象，存储到 fd 中
            fd.append('cover_img', blob);
            $.ajax({
                method: 'post',
                url: '/my/article/add',
                data: fd,
                processData: false,
                contentType: false,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg('发布失败')
                    }
                    layer.msg(res.message);
                    /* // 跳转到文章列表
                    location.href = '/home/article/art_list.html'; */
                    // 左侧高亮跳转
                    let list1 = $(parent.document).find('.lister')[0];
                    let list2 = $(parent.document).find('.lister')[1];
                    list1.click();
                    list2.click();

                }

            })
        })

    })

})