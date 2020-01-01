// 引用art-template渲染引擎
const template = require('art-template');
const querystring = require('querystring');
const sd = require('silly-datetime')
const fs = require('fs');
// 引用formidable处理表单
const formidable = require('formidable');
const url = require('url');
const linkdb = require('./linkdb');

// 使用art-template需要设置根目录
template.defaults.root = './';


module.exports = {
  // 登录
  login_get(req,res) {
    res.render('./login.html',{})
  },
  login_post(req,res){
    let form = formidable.IncomingForm();
    res.setHeader('Content-Type','text/html;charset="utf-8"');
    form.parse(req,(err,fields)=>{
      if(fields.user === 'admin' && fields.pwd === '123'){
        req.session.sessionDate = fields;
        res.setHeader('Content-Type','text/html;charset="utf-8"');
        let jump = '<script>alert("登录成功");window.location.href="./"</script>';
        res.end(jump)
      }else{
        res.setHeader('Content-Type','text/html;charset="utf-8"');
        let jump = '<script>alert("登录失败");window.location.href="./login"</script>';
        res.end(jump)
      }
    })
  },
  // 查询全部数据
  getAll(req,res) {
    if(!req.session.sessionDate){
      res.setHeader('Content-Type','text/html;charset="utf-8"');
      let jump = '<script>alert("请登录");window.location.href="./login"</script>';
      res.end(jump)
      return
    }
    linkdb.select((datas)=>{  // 重点：使用回调函数接受数据
      res.render('./index.html',{data:datas});
    })
  },
  // 添加
  add_get(req,res) {
    linkdb.select((datas)=>{
      res.render('./adduser.html',{data:datas});
    })
  },
  add_post(req,res) {
    let form = formidable.IncomingForm();  // 创建formidable对象，用于解析表单数据
    // 解析传入的数据，err为错误信息，fields为文本信息，files为文件信息
    form.uploadDir = './tmp/' // 设置临时存储位置
    form.parse(req,(err,fields,files)=>{
      let ctime = sd.format(new Date(),'YYYYMMDDHHmmss')
      let files_name = 'img/'+ctime+'_'+files.img.name;
      fs.rename(files.img.path,'./public/'+files_name,(err)=>{
        if(err){
          console.log(err);
        }
      });
      fields.img = files_name;
      linkdb.add(fields,(status)=>{
        if(status >= 1){
          res.setHeader('Content-Type','text/html;charset="utf-8"');
          let jump = '<script>alert("添加成功");window.location.href="/"</script>'
          res.end(jump);
        }
      });
    });
  },
  // 查看单个详情
  getone(req,res) {
    let urlObj = url.parse(req.url).query;  //获得id
    linkdb.where(urlObj).select((datas)=>{  //  链式方式，传入id与数据，使用回调函数接受数据
      res.render('./details.html',{data:datas});
    })
  },
  // 删除
  delete_get(req,res) {
    let urlObj = url.parse(req.url).query;  // 获得id
    linkdb.where(urlObj).delete((status)=>{
      if(status>=1){
        res.setHeader('Content-Type','text/html;charset="utf-8"');
        let jump = '<script>alert("删除成功");window.location.href="/"</script>'
        res.end(jump);
      }
    });
  },
  // 修改
  update_get(req,res) {
    let urlObj = url.parse(req.url).query;  //获得id
    linkdb.where(urlObj).select((datas)=>{  //  链式方式，传入id与数据，使用回调函数接受数据
      res.render('./update.html',{data:datas});
    })
  },
  update_post(req,res){
    let urlObj = url.parse(req.url).query;
    let post_data='';
    req.on('data',(datas)=>{
      post_data += datas;
      return post_data
    });
    req.on('end',()=>{
      post_data = querystring.parse(post_data);
      linkdb.where(urlObj).update(post_data,(status)=>{
        if(status >= 1){
          res.setHeader('Content-Type','text/html;charset="utf-8"');
          let jump = '<script>alert("修改成功");window.location.href="/"</script>'
          res.end(jump);
        }
      });
    });
  }
}