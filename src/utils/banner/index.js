import './prototype.js'
import './animation.css'
// 轮播图，支持左右无缝轮播、淡入淡出效果，同时可自行适配移动端和PC端
//使用了构造函数Prototype及Object.setPrototypeOf()来建立原型链
//使用了Object.defineProperty()进行数据监听
//插件使用方法：
// const banner1 = new Banner({
//     container:'',
//     wrap:'',
//     tags:''
// })

// 将移动端和PC端插件的通用方法写在 Banner 对象中，通用参数和配置则写在Config对象中
const Config = {
    init: function(param) {        
        this.getOptions(param)          // 解析传入的参数，获取相应Dom元素和配置数据，并挂载到实例对象上        
        this.checkConfig()              // 检查配置，参数不合要求时抛出错误        
        this.defineShowIndex()          // 定义本插件的核心属性：showIndex，该属性的变化可直接决定轮播图行为
        this.initStyle(this.showIndex)  // 初始化轮播图样式        
        this.bindEvent()                // 给DOM绑定鼠标事件
    },
    getOptions: function(param){
        this.$doms = {
            container   : document.querySelector(param.container),
            els         : document.querySelectorAll(param.els),
            tags        : document.querySelectorAll(param.tags),
            prev        : document.querySelector(param.prev),
            next        : document.querySelector(param.next)
        }        
        this.$options = {
            _index      : param.index || 0,         //初始显示的坐标，默认为0
            style       : param.style || 'move',    //轮播风格，默认为水平滚动
            client      : param.client || 'pc',     //客户端，默认为pc端
            activeClass : param.activeClass,        //当前显示的tab标签的Class名
            direction   : param.direction || 'x',   //设置滚动方向，默认为水平方向
            canAuto     : param.canAuto || true,    //是否自动轮播，默认为true
            canScroll   : param.canScroll || false, //是否支持滚轮，默认为false
        } 

        // 根据参数获取els的轮播容器元素的固定宽度 
        this.$options.width = this.$doms.container.offsetWidth

        // 让$doms内的所有属性可以被快捷访问
        for(let k in this.$doms){
            Object.defineProperty(this,k,{
                get:function(){
                    return this.$doms[k]
                }
            })
        } 
    },
    defineShowIndex:function() {
        // 定义访问器属性ShowIndex，此属性的改变可触发action函数
        Object.defineProperty(this,'showIndex',{
            get: function() {
                return this.$options._index
            },
            set: function(val) {
                let direction
                if(val === this.$options._index){
                    return 
                } else if(val>this.$options._index){
                    direction = 'next'
                }else{
                    direction = 'prev'
                }                
                // 若showIndex赋值大于图片数量，则归0；赋值小于0，则取最大值
                val = (val<0) ? (this.els.length - 1) : (val===this.els.length) ? 0 : val  
                console.log('val is' + val)               
                // 根据showIndex属性的变化执行相应的轮播行为 
                this.action(this.$options._index,val,direction)
                // 将val赋给_index
                this.$options._index = val
            }
        })
    },
    checkConfig:function() {        
        this.container ? '' : this.throwError(0)
        this.els ? '' : this.throwError(0)
        this.tags ? '' : this.throwError(0)        
        this.els[this.els.length-1].offsetLeft === 0 ? '' : this.throwError(1)
    },
    throwError: function(index) {
        const commenText = '来自Banner插件的错误：'
        errors = [
            '参数未正确填写，请检查是否遗漏（container/els/tags为必填）',    
            'CSS样式无法匹配，请保证所有轮播元素均在容器内（left为0）'        
        ]
        throw commenText + errors[index]
    }
}
// 为移动端和PC端分别构造一个对象
const Banner_pc = {
    bindEvent: function() {
        this.tagsEvent()
        this.buttonEvent()
        this.autoEvent()
        this.mouseEvent()
        this.scrollEvent()
    },
    mouseEvent:function() {
        const self = this 
        this.container.onmouseover = function() {
            self.clear()
        }
        this.container.onmouseout = function() {
            self.autoEvent()
        }
    },
    scrollEvent: function() {
        
    }
}
const Banner_mobile = {
    bindEvent: function() {
        this.tagsEvent()
        this.buttonEvent()
        this.autoEvent()
        this.touchEvent()
    },
    touchEvent: function() {

    }
}
// 将Banner_pc(mobile)对象的[[prototype]]连接到Config对象上
Object.setPrototypeOf(Banner_pc,Config)
Object.setPrototypeOf(Banner_mobile,Config)

// 声明构造函数Banner
function Banner(param) {
    // 根据client参数将Banner.prototype的[[prototype]]连接到pc或mobile对象的其中一个
    if(param.client === 'mobile'){              
        Object.setPrototypeOf(Banner.prototype,Banner_mobile)  
    }else {        
        Object.setPrototypeOf(Banner.prototype,Banner_pc)          
    }
    // 初始化
    this.init(param)
}
// Banner原型上挂载PC和mobile的通用方法
Banner.prototype = {
    initStyle: function(index) {
        const key = index
        const els = this.els       
        const tags = this.tags   
        
        for(let item of els){            
            item.style.opacity = 0
            // item.style.transition = 'opacity 1s ease'
        }   
        els[key].style.opacity = 1
        
        tags[key].addOnlyClass(this.$options.activeClass)
    },    
    setMoveStyle: function(oldIndex,newIndex,direction) { 
        const els = this.els         
        const direct = direction==='next' ? 'left' : 'right' 

        for(let item of els){ 
            item.style.opacity = 0 
        }        
         
        els[oldIndex].style.opacity  = 1
        els[oldIndex].style.animation = `leave-to-${direct} 0.5s 1`
        els[newIndex].style.animation = `enter-to-${direct} 0.5s 1`
        els[newIndex].style.opacity  = 1 

        setTimeout(()=>{
            els[oldIndex].style.opacity  = 0
        },500)
              

        this.tags[newIndex].addOnlyClass(this.$options.activeClass)        
    },
    action: function(oldIndex,newIndex,direction) {
        this.clear()
        this.$options.style === 'opacity' && this.initStyle(newIndex)
        this.$options.style === 'move' && this.setMoveStyle(oldIndex,newIndex,direction)
        this.autoEvent()
    },
    tagsEvent:function() {
        const self = this
        this.tags.forEach(function(item,k){
            item.onclick = function() {
                self.showIndex = k                               
            }
        })
    },
    buttonEvent: function() {
        if(!this.prev && !this.next){
            return
        }
        const self = this
        const max = this.els.length - 1
        this.prev.onclick = function() {   
            // 点击后立即注销事件，防止短时间内频繁点击         
            this.onclick = null
            self.showIndex --            
            // 1s后重新注册事件
            setTimeout(function(){
                self.buttonEvent()
            },1000)
        }
        this.next.onclick = function() {
            this.onclick = null
            self.showIndex ++
            setTimeout(function(){
                self.buttonEvent()
            },1000)
        }
    },
    autoEvent: function(){
        const self = this
        this.clear()
        this.auto = setTimeout(function(){
            self.showIndex ++
        },2500)
    },
    clear: function() {
        clearTimeout(this.auto)
    }
    
}

export default Banner