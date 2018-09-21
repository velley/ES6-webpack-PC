import 'style/index.styl' //引入相应Page的样式文件
import head from 'template/head.hbs'
import banner from 'template/banner.hbs' //引入banner模板
import nav from 'template/nav.hbs'
import api from 'api/user.js'
import ipage from '../pages/index.hbs'


// const tpl = temp({
//     name:'jhon',
//     age:32,
//     skill:'football'
// })
// $('.box').html(tpl)
export default ipage
// const index = new Page({
//     element:'.box',
//     template:temp,
//     data: {
//         person: {
//             name:'jhon',
//             age:32,
//             skill:'football'
//         },
//         lik: null
//     },
//     bindViews:[
//         'person','lik'
//     ],
//     addEvents:[
//         {
//             el:'#demo',
//             type:'click',
//             method:'golong'
//         },{
//             el:'.newone',
//             type:'mouseover',
//             method:'show'
//         }
//     ],
//     created() {
//         this.golong()
//         // setTimeout(()=>{
//         //     this.person= {
//         //         name:'jammie',
//         //         age:72,
//         //         skill:'talk'
//         //     }                         
//         // },3000)
//         setTimeout(()=>{
//             this.person.name = 'god'
//         },4000)
        
//     },
//     onload() {
       
//     },    
//     methods: {
//         golong() {
//             if(event){console.log(event.target)}            
//             console.log(this.person.name)
//         },
//         show() {
//             console.log(9)
//         }
//     }
// })

