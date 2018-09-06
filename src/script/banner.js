import Banner from 'utils/banner'
console.log(Banner)
var banner0 = new Banner({
    container:'.banner-container',
    els:'.banner-item',
    tags:'.tag',            
    next:'.next',
    prev:'.prev',
    activeClass:'light',
})