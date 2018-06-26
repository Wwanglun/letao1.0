/**
 * Created by 52424 on 2018/6/26.
 */
// 动态生成二级分类栏结构
$(function () {
  var currentPage = 1
  var pageSize = 5
  render()
  function render () {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function ( info) {
        $('tbody').html(template('tmp', info))
        $('#second-paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            currentPage = page
            render()
          }
        })
      }
    })
  }
  // 添加二级分类
  $('.add').click(function () {
    $('#addSecond').modal('show')
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function (info) {
        $('.dropdown-menu').html(template('tpl', info))
      }
    })
  })

  // 图片显示
  $("#file").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      var src = data.result.picAddr
      //console.log(src);
      $('#img').attr('src', src)
      $('[name="brandLogo"]').val(src)
      $('#second-form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID')
    }
  });

  // 添加二级分类栏的信息处理
  $('.dropdown-menu').on('click','li',function () {
    $('.txt').text($(this).text())
    $('[name="categoryId"]').val($(this).data('id'))
    $('#second-form').data('bootstrapValidator').updateStatus('categoryId', 'VALID')
  })

  $('#second-form').bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  })

  // 表单校验成功后,触发事件, 使用ajax请求表单提交
  $('#second-form').on('success.form.bv', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      data: $('#second-form').serialize(),
      dataType: 'json',
      success: function (info) {
        console.log(info);
        if (info.success) {
          $('#addSecond').modal('hide')
          $('#second-form').data('bootstrapValidator').resetForm(true)
          currentPage = 1
          render()
          $('.txt').text('请选择一级分类')
          $('#img').attr('src','./images/none.png')
        }
      }

    })
  })

})