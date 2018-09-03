import 'style/index.styl' //加载相应Page的样式文件
import temp from 'template/banner.string'

const index = new Page({
    element:'.box',
    template:temp,
    data: {
        name : 'me'
    },
    created() {
        console.log(this.$data.name)
    },
    onload() {
        this.send({name:this.name})
    }
})

