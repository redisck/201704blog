let express = require('express');
//生成一个路由中间件的实例
let router = express.Router();
//解析上传文件的中间件 长笛
//只会仅仅会处理enctype="multipart/form-data"
let multer = require('multer');
//调用此multer方法，传入配置参数，在参数中指定上传后的文件的保存位置
//此处的.指代的是当前目录，它其实指的是server.js(启动文件)的所有在目录，而非user.js所在目录
//dest=destination 目标路径
let upload = multer({dest:'./public'});
let {User} = require('../model');
router.get('/signup', function (req, res) {
  //1参数是相对于模板的根目录的相对路径
  // res.locals 才是真正渲染模板的对象
  //res.locals.title = '用户注册';
  res.render('user/signup');
});
//提交用户注册表单
//upload.single('avatar')会得到一个中间件函数，此中间件函数会在路由匹配之后执行
//single意思是此表单里只有一个文件字段，字段的名称叫avatar
//引入此中间件之后，req.file指向上传后的文件对象。req.body存放着所有的其它的文本类型的字段
//此中间件会解析请求体，把文件字段存放req.file,把其它 的文本类型字段存入req.body
router.post('/signup',upload.single('avatar'), function (req, res) {
  //先得到bodyParser中间件解析得到的user对象
  //{ username: '2', password: '2', email: '2@2.com' }
  let user = req.body;
  /*console.log(user);
  console.log(req.file);*/
  //  /e7abae1a9d9ae0fb113014c8e8912646
  user.avatar = `/${req.file.filename}`;
  //找一个数据库里有没有跟自己用户名相同的用户
  User.findOne({username: user.username}, function (err, oldUser) {
    if (err) {
      //写入一个错误的消息
      /*{
        error:[err1,err2],
        success:[success1,success2]
      }*/
      req.flash('error',err.toString());
      res.redirect('back');
    } else if (oldUser) {
      req.flash('error','用名已经存在');
      res.redirect('back');
    } else {
      User.create(user, function (err, doc) {
        if (err) {
          req.flash('error',err.toString());
          res.redirect('back');
        } else {
          req.flash('success','恭喜你注册成功!');
          res.redirect('/user/signin');
        }
      });
    }
  })
});
router.get('/signin', function (req, res) {
  res.render('user/signin',{title:'用户登录'});
});
//提交登录表单
router.post('/signin', function (req, res) {
  let user = req.body;
  User.findOne(user,function(err,oldUser){
    if(err){
      req.flash('error',err.toString());
      res.redirect('back');
    }else{
      if(oldUser){
        req.flash('success','登录成功');
        //如果登录成功之后会把查询到的用户对象赋给会话对象的user属性
        req.session.user = oldUser;
        res.redirect('/');
      }else{//1.路由里写消息 2.中间件里读消息，而且中间件要放在flash和路由中间件之间 3.模板要读取这个变量
        req.flash('error','用户名密码不正确');
        res.redirect('back');
      }
    }
  });
});
router.get('/signout', function (req, res) {
  //把session的user属性设置为null就变成了未登录态
  req.session.user = null;
  //所有的URL路径 redirect app.get router.get都必须是/开头
  //所有的模板路径 res.render 都不用/开头
  res.redirect('/user/signin');
});
module.exports = router;
/**
 * {
 * fieldname: 'avatar', 文件名称
  originalname: 'mobile.jpg',原始的文件名
  encoding: '7bit',
  mimetype: 'image/jpeg',内容类型 image/jpeg
  destination: './public',目标路径
  filename: 'e7abae1a9d9ae0fb113014c8e8912646',重命名的文件名
  path:  'public\\e7abae1a9d9ae0fb113014c8e8912646',文件路径
  size: 16984 }文件大小
 **/