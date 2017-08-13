//1.引入express模块
let express = require('express');
//首页路由
let index = require('./routes/index');
//用户路由
let user = require('./routes/user');
//文章相关的路径
let article = require('./routes/article');
//引入session中间件
let session = require('express-session');
//使用mongodb存储会话的中间件,返回一个函数，需要执行并传入session
let MongoStore = require('connect-mongo')(session);
//这是一个消息提示的中间件 特点就是一闪而过，一旦读取之后立刻全部销毁
let flash = require('connect-flash');

//文章分类路由
let category = require('./routes/category');
let bodyParser = require('body-parser');
let path = require('path');
//2.执行express方法得到app
let app = express();
//把urlencoded格式的字符串转成json对象  req.body=请求体对象
app.use(bodyParser.urlencoded({extended:true}));
//1.设置模板引擎,其实就是指定模板的扩展名
app.set('view engine','html');
//2.设置模板的存放目录
app.set('views',path.resolve('views'));
//3.设置html类型的模板使用哪个方法来进行渲染
app.engine('.html',require('ejs').__express);
//指定一个静态文件根目录，当服务器收到一个请求的时候，会在静态文件根目录后面拼上请求的路径，
app.use(express.static(path.resolve('node_modules')));
//把public目录做为静态文件根目录
app.use(express.static(path.resolve('public')));
//使用了此中间件之后，会在req.session属性
app.use(session({
  resave:true,//每次重新保存session
  saveUninitialized:true,//保存未初始化的session
  secret:'zfpx', //加密cookie的秘钥
  //指定会话存储的位置 数据库(mongodb) 文件系统 内存(默认值)
  store:new MongoStore({
    url:'mongodb://127.0.0.1/201704blog'
  })
}));
//使用此flash中间件，使用了它以后会在请求对象上多一个flash属性，flash是一个方法，传二个参数表示存储消息，传一个参数表示读取消息，读完之后立刻销毁
// req.flash(type,msg); req.flash(type)
app.use(flash());
//给模板赋一些公用的变量
app.use(function(req,res,next){
  //res.locals 才是真正渲染模板的对象
  res.locals.title = '珠峰博客';
  //在中间件里把成功消息从flash中取出，然后赋给模板使用
  res.locals.success = req.flash('success').toString();
  //在中间件里把失败的消息从flash中取出，然后赋给模板使用
  res.locals.error = req.flash('error').toString();
  //一旦读取之后，此消息就被销毁了
  //每次服务器接收到请求后，把会话对象中的user属性取出来赋给模板的数据对象
  res.locals.user = req.session.user;
  next();
});
//如果说客户端访问的URL路径是以/开头的话，会走index路由中间件
app.use('/',index);
//客户端访问URL路径是以/user开头的话，会走user路由中间件,此路径后面必须跟的是/(路由分隔符)
app.use('/user',user);
//当客户端访问的路径是以/article开头的话，交由article路由中间件执行
app.use('/article',article);
app.use('/category',category);
//3.监听9090端口
app.listen(9090);
