// import 'babel-polyfill' //由于axios基于Promise，所以需要加载babel-polyfill来兼容IE
import axios from 'axios'
// 创建实例
const instance = axios.create({
    timeout:1000,
    headers:{'Content-Type': 'application/json;charset=UTF-8'}
})

// 封装axios请求函数并输出
export default (url,method,data)=>{
    if(typeof method === 'object' && !data){
        var data = method
        var method = 'get'
    }else if(method!==('post' || 'get')){
        throw 'axios请求参数有误，请检查是否输入正确'
    }
    return instance[method](url,data).then((res)=>{
        return Promise.resolve(res.data)
    }).catch(()=>{

    })
}