//1.先引入mongoose模块
let mongoose = require('mongoose');
mongoose.Promise = Promise;
let ObjectId = mongoose.Schema.Types.ObjectId;
//2.连接你的mongodb数据
let conn = mongoose.createConnection('mongodb://127.0.0.1/201704blog');
//3.定义数据库集合的骨架模型，定义集合中文档的字段的名称和字段的类型
let UserSchema = new mongoose.Schema({
  username:String,//用户名
  password:String,//密码
  email:String,//邮箱
  avatar:String//头像
});
//定义用户的模型
let User = conn.model('User',UserSchema);
exports.User = User;
//文章分类的骨架模型
let CategorySchema = new mongoose.Schema({
  name:String,
  //外键就是别人家的主键.
  //ObjectId 是主键 _id的类型,这个user属性是一个外键，引用的是User集合的主键  通过ref来指定通过ID查询对象的时候要从哪个集合中查询,或者说调用哪个模型的findbyid方法进行查询
  user:{type:ObjectId,ref:'User'}
});
//定义数据库模型
let Category = conn.model('Category',CategorySchema);
exports.Category = Category;
// module model
// Component comment
let ArticleSchema = new mongoose.Schema({
  title:String,//标题
  content:String,//内容
  category:{type:ObjectId,ref:'Category'},//文章的分类，是一个外键，引用的是分类集合的键
  user:{type:ObjectId,ref:'User'},//当前文章的作者 是一个外键，引用的是用户集合的主键
  //创建时间类型是日期类型，默认值是Date.now
  createAt:{type:Date,default:Date.now}
})
//定义一个文章模型
let Article = conn.model('Article',ArticleSchema);
exports.Article = Article;