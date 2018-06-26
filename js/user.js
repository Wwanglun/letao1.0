/**
 * Created by 52424 on 2018/6/26.
 */

// 动态渲染用户信息及分页功能
$(function () {
  var currentPage = 1
  var pageSize = 5
  var id = 0
  var isDelete = 0
  render()
 function render () {
   $.ajax({
     type: 'get',
     url: '/user/queryUser',
     data: {
       page: currentPage,
       pageSize: pageSize
     },
     success: function (info) {
       $('tbody').html(template('tmp', info))
       $('#paginator').bootstrapPaginator({
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


//显示禁用或启用模态框
  $('tbody').on('click', '.btn', function () {
    $('#userModal').modal('show')
    id = $(this).parent().data('id')
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1
  })

  $('.sureBtn').click(function () {
    $.ajax({
      type: 'post',
      url: '/user/updateUser',
      data: {
        id: id,
        isDelete: isDelete
      },
      dataType: 'json',
      success: function (info) {
        if (info.success) {
          $('#userModal').modal('hide')
          render()
        }
      }
    })
  })

})
