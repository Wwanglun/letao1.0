/**
 * Created by 52424 on 2018/6/26.
 */
// 一级分类目录动态生成
$(function () {
  var currentPage = 1
  var pageSize = 3
  render()
  // 分页功能
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {
        $('tbody').html(template('tmp', info))
        // 分页操作
        $('#first-paginator').bootstrapPaginator({
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
  // 设置添加分类
  $('.add').click(function () {
    $('#addFirst').modal('show')
  })

  // 校正表单
  $('#first-form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: '分类名不能为空'
          }
        }
      }
    }
  })

  // 点击确定按钮添加
  $('#first-form').on('success.form.bv', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/category/addTopCategory',
      data:  $('#first-form').serialize(),
      dataType: 'json',
      success: function (info) {
        console.log(info);
        if (info.success) {
          $('#addFirst').modal('hide')
          currentPage = 1
          render()
          $('#first-form').data('bootstrapValidator').resetForm(true)
        }
      }
    })
  })




})