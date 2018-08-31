// 对html模板引擎PUG的封装
import pug from 'pug'

export default (template,data)=>{
    const temp = pug.compileFile(template)
    return temp(data)
}