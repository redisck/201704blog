let express = require('express');
let {Article} = require('../model');
let router = express.Router();
router.get('/',function(req,res){
  //exec表示真正执行查询，查询完成后调用回调函数
  //populate把一个属性从ID变成此ID对应的对象
  Article.find({}).populate('user').populate('category').exec(function(err,articles){
    res.render('index',{articles});
  });
});
module.exports = router;