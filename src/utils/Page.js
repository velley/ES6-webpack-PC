import renderHTML from '@/utils/hogan.js'

export default class Page {
    init() {
        this.checkError()
        this.onload()
    }
    constructor(param) {
        const instance = this
        // 将属性与方法挂载至实例
        param.data      && (instance.$data = param.data)
        param.methods   && (instance.$methods = param.methods)
        param.element   && (instance.$element = param.element)
        param.template  && (instance.$template = param.template) 
        //新定义一个data属性，专门存放用于渲染html模板的数据
        instance.$htmlData = [] 

        instance.onload = function() {
            window.onload = ()=>{
                param.onload && param.onload.call(instance) //页面加载完成后执行自定义的方法
                instance.render() //页面加载完成后自动执行模板渲染
            }
        }
        // 让Page实例的属性与方法可以快捷访问
        for(let key in instance.$data){
            Object.defineProperty(instance,key,{
                get:function() {
                    return this.$data[key]
                    if(Object.hasOwnProperty(this.$methods,key)){
                        throw 'Page实例的方法与属性命名不可相同'
                    }
                },
                set:function(val) {
                    this.$data[key] = val
                }
            })
        }
        for(let key in instance.$methods){
            Object.defineProperty(instance,key,{
                get:function() {
                    if(Object.hasOwnProperty(this.$data,key)){
                        throw 'Page实例的方法与属性不可相同命名'
                    }
                    return this.$methods[key]
                },
                set:function(val){
                    throw 'Page实例的method方法不可重复定义'
                }
            })
        }
        // 上述步骤完成后，可以再created方法内访问实例的属性与方法
        param.created   && (instance.created = param.created.apply(instance))
        // 实例初始化，页面加载完成后可以自动执行相应方法
        instance.init()
    }
    // 该函数需要手动调用，用于将渲染数据传送给对应的html模板
    send(data,index) {
        if(typeof data !== 'object'){
            throw 'send方法的第一个参数必须是一个对象'
        }
        let i = index || 0  
        if(this.$htmlData[i]){
            this.$htmlData[i] = Object.assign(this.$htmlData[i],data)
        }else{
            this.$htmlData[i] = data
        }
    }
    // 该函数在创建实例时会自动调用（页面加载完成后）
    render() {
        const htmlData = this.$htmlData
        if(this.$template){
            const temp = this.$template
            const el = this.$element            
            if(Array.isArray(temp)){
                for(key in temp){
                    const html = renderHTML(temp[key],htmlData[key])
                    const item = document.querySelector(el[key]) 
                    item.innerHTML = html
                }
            }else{
                console.log(el)
                document.querySelector(el).innerHTML = renderHTML(temp,htmlData[0])
            }
            
        }
    }
    checkError() {
        if(!Array.isArray(this.$template) && !Array.isArray(this.$element)){
            return
        }else{
            if(this.$template.length !== this.$element.length){
                throw 'dom节点数量和template模板数量必须一致'
            }
        }
        for(item of this.$methods){
            if(typeof item === 'function'){
                return
            }else{
                throw 'methods内存在非法属性（请保证methods内定义的属性都是函数）'
            }
        }
    }
}