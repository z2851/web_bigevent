$(function () {
  var layer = layui.layer
  var form = layui.form

  initArtCateList()

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过事件委托，为 form-add 表单绑定 submit 事件  要委托给本身就存在的元素而不是后来动态添加上的元素身上
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd)
      }
    })
  })

  // 事件委托，为 btn-edit 按钮绑定点击事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })

    var id = $(this).attr('data-id')

    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id, // /my/article/cates/:id restful传参 只需要传递参数值不需要参数名
      success: function (res) {
        // console.log(res);
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理的方式，为(动态添加的)修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method:'POST',
      url: '/my/article/updatecate',
      data:$(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      }
    })


    // 或者也可以通过本地存储来获取数据
    // var name = $("#username").val();
    // var alias = $("#aname").val();
    // $.ajax({
    //   method: 'POST',
    //   url: '/my/article/updatecate',
    //   data: {
    //     name: name,
    //     alias: alias,
    //     Id: localStorage.setItem("id")
    //   },
    //   success: function (res) {
    //     if (res.status !== 0) {
    //       return layer.msg('更新分类数据失败！')
    //     }
    //     layer.msg('更新分类数据成功！')
    //     layer.close(indexEdit)
    //     initArtCateList()
    //   }
    // })




  })

  // 事件委托，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })
})
