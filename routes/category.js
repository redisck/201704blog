let express = require('express');
let {Category} = require('../model');
let router = express.Router();
router.get('/list',function(req,res){
  //查询出所有的分类的列表
  //查询时候只能查出来创建者是当前登录者的ID的分类
  Category.find({user:req.session.user._id},function(err,categories){
    //渲染文章分类的模型
    res.render('category/list',{categories,title:'文章分类管理'});
  });
});
router.get('/add',function(req,res){
  res.render('category/add');
});
//增加分类请求
router.post('/add',function(req,res){
  let category = req.body;
  //把会话对象中的user属性的主键赋给分类的user属性
  //谁登录，当前创建的分类对象的拥有人就是当前登录的用户ID
  category.user = req.session.user._id;
  //把分类对象保存到数据库中
  Category.create(category,function(err,doc){
    if(err){
      req.flash('error',err.toString());
      res.redirect('back');
    }else{
      req.flash('success','添加分类成功');
      res.redirect('/category/list');
    }
  });
});
router.get('/delete/:_id',function(req,res){
  let _id = req.params._id;
  Category.remove({_id},function(err,result){
    if(err){
      req.flash('error',err.toString());
      res.redirect('back');
    }else{
      req.flash('success','删除分类成功');
      res.redirect('back');
    }
  });
});
module.exports = router;