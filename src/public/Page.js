import renderHTML from '../utils/render.js'

export default class Page {
    init() {
        this._checkError()
        this.onload()
    }
    constructor(param) {
        const instance = this
        // 将属性/方法以及相应的模板和元素节点挂载至实例
        param.data          && (instance.$data = param.data)
        param.methods       && (instance.$methods = param.methods)
        param.element       && (instance.$element = param.element)
        param.template      && (instance.$template = param.template) 
        // 挂载钩子函数（执行完相关逻辑代码后自动调用）
        param.afterRender   && (instance.afterRender = param.afterRender)
        param.updateRender  && (instance.afterRender = param.updateRender)
        //新定义一个htmlData属性，专门存放用于渲染html模板的数据
        instance.$htmlData = [] 
        // onload事件，用于主页面加载完成时自动触发渲染函数以及其他自定义方法（原则上无需使用此方法）
        instance.onload = function() {
            window.onload = ()=>{
                param.onload && param.onload.call(instance) //页面加载完成后执行自定义的方法                
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
        // 上述步骤完成后，调用钩子函数created,可以在此函数内访问实例的属性与方法
        param.created   && (instance.created = param.created.apply(instance))
        // 实例初始化，页面加载完成后可以自动执行相应方法
        instance.init()
    }
    // 该函数需要手动调用，用于将渲染数据传送给对应的html模板
    send(data,index=0) {
        if(!this.$template || !this.$element){
            throw '数据渲染需要定义template与element属性'
        }
        if(typeof data !== 'object'){
            throw 'send方法的第一个参数必须是Object类型'
        }        
        if(this.$htmlData[index]){
            this.$htmlData[index] = Object.assign(this.$htmlData[index],data)
        }else{
            this.$htmlData[index] = data
        }
        this._render(this.$htmlData[index],index)
    }
    // 页面数据渲染，该函数在send方法完成时自动调用
    _render(data,key=0) {
        const temp = this.$template
        const el = this.$element            
        if(Array.isArray(temp)){            
            const html = renderHTML(temp[key],data)
            const item = document.querySelector(el[key]) 
            item.innerHTML = html            
        }else{            
            document.querySelector(el).innerHTML = renderHTML(temp,data)
        } 
        // 渲染完成后，自动调用钩子函数afterRender或updateRender
        if(this.firstRender){
            this.updateRender && this.updateRender()
        }else{
            this.firstRender = true
            this.afterRender && this.afterRender()
        }  
    }    
    _checkError() {
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

window.Page = Page