import 'style/index.styl' //引入相应Page的样式文件
import temp from 'template/banner.string' //引入hogan模板

const index = new Page({
    element:'.box',
    template:temp,
    data: {
        person: {
            name:'jhon',
            age:32,
            skill:'football'
        }
    },
    created() {
        // console.log(this.$data.name)   
        this.send(this.$data) 
    },    
    firstRender() {
        $('#list').on('click',function(){
            alert('被点击了')
        })
    },
    updateRender() {
        alert('更新渲染成功')
    },
    methods: {
        golong() {
            console.log(this.name)
        }
    }
})

