import 'style/index.styl' //引入相应Page的样式文件
import temp from 'template/banner.string' //引入hogan模板
import api from 'api/user.js'
api.checkLogin().then((res)=>{
    console.log(res)
})
const index = new Page({
    element:'.box',
    template:temp,
    data: {
        person: {
            name:'jhon',
            age:32,
            skill:'football'
        },
        lik: null
    },
    bindViews:[
        'person','lik'
    ],
    addEvents:[
        {
            el:'#demo',
            type:'click',
            method:'golong'
        },{
            el:'.newone',
            type:'mouseover',
            method:'show'
        }
    ],
    created() {
        this.golong()
        // setTimeout(()=>{
        //     this.person= {
        //         name:'jammie',
        //         age:72,
        //         skill:'talk'
        //     }                         
        // },3000)
        setTimeout(()=>{
            this.person.name = 'god'
        },4000)
        
    },
    onload() {
       
    },    
    methods: {
        golong() {
            if(event){console.log(event.target)}            
            console.log(this.person.name)
        },
        show() {
            console.log(9)
        }
    }
})

