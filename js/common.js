/**
 * Created by 52424 on 2018/6/25.
 */

$(function () {
  //  设置登录校正功能
  $('#form').bootstrapValidator({

    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 设置校正规则字段
    fields: {
      username: {
        validators: {
          notEmpty: {
            message: '用户名不能为空'
          },
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2-6位'
          },
          callback: {
            message: '用户名错误'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: '用户名不能为空'
          },
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2-6位'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    }
  });

  // 取消表单的默认提交方式, 使用ajax请求
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/employee/employeeLogin',
      data: $('#form').serialize(),
      success: function (info) {
        console.log(info);
        if (info.success === true) {
          location.href = 'index.html'
        }
        if (info.error === 1001) {
          //alert(info.message)
          $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback')
        }
        if (info.error === 1000) {
          //alert(info.message)
          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback')
        }
      }
    })
  })

  // 重置表单及表单验证状态
  $('button[type="reset"]').click(function () {
    $('#form').data('bootstrapValidator').resetForm(true)
  })

  // 设置进度条
  // 当第一个ajax的请求发送时调用
  $(document).ajaxStart(function () {
    NProgress.start()
  })
  // 当最后一个ajax的请求结束时调用
  $(document).ajaxStop(function () {
    setTimeout(function () {
      NProgress.done()
    })
  })
})

