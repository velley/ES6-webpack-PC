import renderHTML from '../utils/render.js'

// 新建一个Page原型，用于处理与html页面相关的通用逻辑（如dom数据渲染、事件绑定）
export default class Page {
    _init() {
        this._checkError()
        this.onload()
    }
    constructor(param) {
        const instance = this
        // 将data属性/方法以及相应的模板和节点属性挂载至实例对象
        param.data          && (instance.$data = param.data)
        param.methods       && (instance.$methods = param.methods)
        param.element       && (instance.$element = param.element)
        param.template      && (instance.$template = param.template) 
        // 挂载钩子函数（执行完相关逻辑代码后自动调用）
        param.firstRender   && (instance.firstRender = param.firstRender)
        param.updateRender  && (instance.updateRender = param.updateRender)
        // 挂载用于双向绑定的属性（渲染模板数量=1时此属性才会生效，否则报错）
        param.bindViews     && (instance.bindViews = param.bindViews)
        //新定义一个htmlData属性，存放用于渲染html模板的数据
        instance.$htmlData = [] 
        // onload事件，用于主页面加载完成时自动触发自定义方法（原则上无需使用此方法）
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
                    console.log('改变了')                 
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
        // 实例初始化,执行错误检查等逻辑操作
        instance._init()
        // 上述步骤完成后，自动调用钩子函数created,可以在此函数内访问实例的属性与方法
        param.created   && (instance.created = param.created.apply(instance))
    }
    // 该函数需要手动调用，用于将数据传给对应的html模板进行渲染
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
    // 页面数据渲染，该函数在send方法内自动调用
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
        if(this.hasRender){
            this.updateRender && this.updateRender()
        }else{
            this.hasRender = true
            this.firstRender && this.firstRender()
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

        for(key in this.$methods){
            if(typeof this.$methods[key] === 'function'){
                return
            }else{
                throw 'methods内存在非法属性（请保证methods内定义的属性都是函数）'
            }
            if(key === 'send' || 'init'){
                'methods方法命名冲突，send/init均为原型方法，请更改命名'
            }
        }
    }
}

window.Page = Page