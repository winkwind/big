$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }

                // 渲染页面的数据
                let arr = [];
                res.data.forEach(item => {
                    // 时间渲染
                    /* let d = new.Date(item.pub_date);
                    let t = d.toLocaleString('zh-CN', {
                        hour12: true,
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        weekday: 'long',
                    }) */
                    arr.push(`<tr>
                    <td>${item.title}</td>
                    <td>${item.cate_name}</td>
                    <td>${item.pub_date}</td>
                    <td>${item.state}</td>
                    <td>
                      <button type="button" class="layui-btn layui-btn-xs edit" data-id="${item.Id}">编辑</button>
                      <button type="button" class="layui-btn layui-btn-danger layui-btn-xs del" data-id="${item.Id}">删除</button>
                    </td></tr>`)
                });
                $('tbody').html(arr.join(''));
                // 分页
                page(res.total);
            }
        })
    }
    initTable();
    // 获取分类
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
    // 筛选
    $("#form_choose").on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $("#cate_id").val()
        q.state = $("#state").val()
        initTable();
    })
    // 分页区域
    function page(total) {
        laypage.render({
            elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页显示条数
            curr: q.pagenum,//起始页
            limits: [2, 3, 5, 7, 9],//每页显示条数快捷选择
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 切换分页的回调
            // 切换显示条数的时候也会触发
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数
                q.pagenum = obj.curr//获取最新分页
                q.pagesize = obj.limit//获取每页显示条数
                //首次不执行
                if (!first) {
                    // 点击页码时，first为underfined，否则为true
                    // 所以当first为true时，表示下面的方法不是通过点击页码触发
                    // 为避免出现回调地狱，只需要点击时触发
                    initTable();
                }
            }
        });
    }
    // 删除请求
    $("tbody").on('click', '.del', function () {
        let len = $(".del").length;
        // 获得点击按钮所在的id
        let id = $(this).data('id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function () {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // len为1的时候表示页面上只有一个数据，此时已经点击了删除，页面上便没有数据，下方的页码索引根据总数生成所以会少一页，但页面渲染时pagenum没变还是会停留在这一页，所以要进行判断

                    // 页码不可小于1，所以当页码为1时不能减一而是停留当前页面
                    if (len === 1 && q.pagenum > 1) {
                        q.pagenum -= 1;
                    }
                    initTable();
                }
            })
        })
    })
    // 更新文章
    // 弹出层
    $("tbody").on('click', '.edit', function () {
        // 获得点击按钮所在的id
        let id = $(this).data('id');
        // 请求该id对应的数据并渲染到弹出层
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                localStorage.setItem('res', JSON.stringify(res.data))
            }
        })
        layer.open({
            type: 2,
            area: ['1650px', '835px'],
            title: '修改文章内容',
            content: '/home/article/art_pop.html',
        })

    })


})