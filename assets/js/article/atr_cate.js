$(function () {
    layer = layui.layer;
    form = layui.form;
    // 请求文章列表
    function load() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success(res) {
                let arr = [];
                // 渲染页面
                res.data.forEach(item => {
                    arr.push(` <tr>
                        <td>${item.Id}</td>
                        <td>${item.name}</td>
                        <td>${item.alias}</td>
                        <td><button type="button" class="layui-btn edit" data-id="${item.Id}">编辑</button>
                        <button type="button" class="layui-btn layui-btn-danger del" data-id="${item.Id}">删除</button></td>
                        </tr>`)
                });
                $("tbody").html(arr.join(''));
            }
        })
    }
    load();
    // 新增文章分类
    // 弹出层
    $("#addatr").on('click', function () {
        layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $("#dialog_add").html(),
        })
    })
    // 新增请求
    // 因为表单是点击后生成的，所以不能直接给表单注册而是委托
    $("body").on('submit', '#form_add', (e) => {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $("#form_add").serialize(),
            success(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('添加失败')
                }
                load();
                layer.msg('新增成功')
                layer.closeAll('page')
            }
        })
    })

    // 编辑文章分类
    // 也是用委托的方式
    // 弹出层
    $("tbody").on('click', '.edit', function () {
        // 获得点击按钮所在的id
        let id = $(this).data('id');
        // 请求该id对应的数据并渲染到弹出层
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form_edit', res.data)
                console.log(res.data);
            }
        })
        layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $("#dialog_edit").html(),
        })

    })
    // 编辑请求
    $("body").on('submit', '#form_edit', (e) => {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $("#form_edit").serialize(),
            success(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('编辑失败')
                }
                load();
                layer.msg('编辑成功')
                layer.closeAll('page')
            }
        })
    })
    // 删除请求
    $("tbody").on('click', '.del', function () {
        // 获得点击按钮所在的id
        let id = $(this).data('id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function () {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    load();
                }
            })
        })
    })
















})