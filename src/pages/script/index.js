import 'style/index.styl'
import api from 'api/user.js'
// import 'babel-polyfill'
api.checkLogin().then((res)=>{    
    console.log(res)
})

console.log(Promise)

