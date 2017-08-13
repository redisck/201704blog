let express = require('express');
let {Article,Category} = require('../model');
let router = express.Router();
// 增加文章 修改文章 删除文章 查看文章列表
// /article/add
router.get('/add',function(req,res){
  Category.find({user:req.session.user._id},function(err,categories){
    res.render('article/add',{categories,article:{}});
  })
});
router.post('/add',function(req,res){
  let article = req.body;
  //文章的作者也是从当前的登录对象中获取的ID
  article.user = req.session.user._id;
  //利用模型的create方法把请求体对象保存到数据库中
  Article.create(article,function(err,doc){
     if(err){
       req.flash('error',err.toString());
       res.redirect('back');
     }else{
       req.flash('success','发表文章成功');
       //如果发表成功则跳回首页，也就是文章列表页
       res.redirect('/');
     }
  });
});
router.get('/detail/:_id',function(req,res){
  let _id = req.params._id;//先得到路径中的ID
  //通过ID查找文章对象，把category user从ID变成对象
  Article.findById(_id).populate('category').populate('user').exec((err,article)=>{
    res.render('article/detail',{article});
  });
});
router.get('/delete/:_id',function(req,res){
  let _id = req.params._id;
  Article.remove({_id},function(err,result){
    if(err){
      req.flash('error',err.toString());
      res.redirect('back');
    }else{
      req.flash('success','删除成功');
      res.redirect('/');
    }
  })
});
router.get('/update/:_id',function(req,res){
  let _id = req.params._id;
  //先查询出当前登录用户的文章分类数组
  Category.find({user:req.session.user._id},function(err,categories){
    //根据ID查询文章对象
    Article.findById(_id).exec(function(err,article){
      res.render('article/add',{article,categories});
    });
  })
});
router.post('/update/:_id',function(req,res){
  let _id = req.params._id;
  let article = req.body;
  Article.update({_id},article,function(err,result){
     if(err){
       req.flash('error',err.toString);
       res.redirect('back');
     }else{
       res.redirect(`/article/detail/${_id}`);
     }
  });
});
module.exports = router;