/**
 * Created by 52424 on 2018/6/28.
 */
 $(function () {
   // 动态生成结构
   var currentPage = 1
   var pageSize = 3
   var arr = []
   var str = ''
   render()
   function render() {
     $.ajax({
       type: 'get',
       url: '/product/queryProductDetailList',
       data: {
         page: currentPage,
         pageSize: pageSize
       },
       success: function (info) {
         //console.log(info);
         $('tbody').html(template('tmp', info))
         $('.page').bootstrapPaginator({
           bootstrapMajorVersion: 3,
           currentPage: currentPage,
           totalPages: Math.ceil(info.total / info.size),
           onPageClicked: function (a, b, c, page) {
             currentPage = page
             render()
           },
           itemTexts: function (type, page, current) {
             switch (type) {
               case 'page':
                 return page
               case 'next':
                 return '下一页'
               case 'last':
                 return '尾页'
               case 'prev':
                 return '上一页'
               case 'first':
                 return '首页'
             }
           },

           tooltipTitles: function (type, page, current) {
             switch (type) {
               case 'page':
                 return page
               case 'next':
                 return '下一页'
               case 'last':
                 return '尾页'
               case 'prev':
                 return '上一页'
               case 'first':
                 return '首页'
             }
           },
           useBootstrapTooltip: true
         })
       }
     })
   }

   // 显示模态框
   $('.add').click(function () {
     $('#addProduct').modal('show')

     // 生成二级分类目录
     $.ajax({
       type: 'get',
       url: '/category/querySecondCategoryPaging',
       data: {
         page: 1,
         pageSize: 100
       },
       success: function (info) {
         //console.log(info);
         $('.dropdown-menu').html(template('tpl', info))
       }
     })
   })

   // 选择二级分类
   $('.dropdown-menu').on('click', 'li', function () {
     $('.txt').text($(this).text())
     $('[name="brandId"]').val($(this).data('id'))
     $('#product-form').data('bootstrapValidator').updateStatus('brandId', 'VALID')
   })

   // 使用jquery.fileupload
   $('#file').fileupload({
     dataType: 'json',
     done: function (e, data) {
       var src = data.result // 得到上传图片的地址存储在/product/addProductPic文件中, 还没存在数据库中
       arr.unshift(src)
       $('.imgshow').prepend('<img src="'+ src.picAddr +'" width="100" height="100">')
       if (arr.length > 3) {
         arr.pop()
         $('.imgshow img:last-of-type').remove()
       }
       if (arr.length === 3) {
         $('#product-form').data('bootstrapValidator').updateStatus('picstatus','VALID')
         //console.log(arr);
         str = $('#product-form').serialize()
         str += '&picName1=' + arr[0].picName + '&picAddr1=' + arr[0].picAddr
         str += '&picName1=' + arr[1].picName + '&picAddr1=' + arr[1].picAddr
         str += '&picName1=' + arr[2].picName + '&picAddr1=' + arr[2].picAddr
         console.log(str);
       }
     }
   })

   // 使用bootstrapValidator 插件验证
   $('#product-form').bootstrapValidator({
     excluded: [],
     feedbackIcons: {
       valid: 'glyphicon glyphicon-ok',
       invalid: 'glyphicon glyphicon-remove',
       validating: 'glyphicon glyphicon-refresh'
     },
     fields: {
       brandId: {
         validators: {
           notEmpty: {
             message: '请输入二级分类'
           }
         }
       },
       proName: {
         validators: {
           notEmpty: {
             message: '请输入商品名称'
           }
         }
       },
       proDesc: {
         validators: {
           notEmpty: {
             message: '请输入商品描述'
           }
         }
       },
       num: {
         validators: {
           notEmpty: {
             message: '请输入商品库存'
           },
           regexp: {
             regexp: /^[1-9]\d*$/,
             message: '商品库存格式, 必须是非零开头的数字'
           }
         }
       },
       size: {
         validators: {
           notEmpty: {
             message: '请输入商品尺寸'
           },
           regexp: {
             regexp: /^\d{2}-\d{2}$/,
             message: '尺码格式, 必须是 32-40'
           }
         }
       },
       oldPrice: {
         validators: {
           notEmpty: {
             message: '请输入商品原价'
           }
         }
       },
       price: {
         validators: {
           notEmpty: {
             message: '请输入商品现价'
           }
         }
       },
       picstatus: {
         validators: {
           notEmpty: {
             message: '请上传三张图片'
           }
         }
       }
     }
  })

   // 验证成功后, 使用ajax请求数据
   $('#product-form').on('success.form.bv', function (e) {
     e.preventDefault()
     $.ajax({
       type: 'post',
       url: '/product/addProduct',
       data: str,
       success: function (info) {
         //console.log(info);
         if (info.success === true) {
           $('#addProduct').modal('hide')
           $('#product-form').data('bootstrapValidator').resetForm(true)
           $('.imgshow img').remove()
           $('.txt').text('请选择二级分类')
           currentPage = 1
           render()
         }
       }
     })
   })


 })