//第一步：判断元素是否有已含有指定的class名  
Element.prototype.hasClass = function(cls){
    cls = cls || "";    //若不传入cls参数，则cls值为空
    var reg = new RegExp(cls);     
    if(cls.replace(/\s/g,"").length == 0){
        return false;     
    }else if(reg.test(this.className)){
        return true;
    }else{
        return false;
    };
};
//第二步：添加指定class名
Element.prototype.addClass=function(cls){
    if(!this.hasClass(cls)){
        this.className = this.className == "" ? cls : this.className + " " + cls;
    }else{
        return null;
    }
};
//第三步：删除指定class名
Element.prototype.removeClass = function(cls){
    // alert(1);
    if(this.hasClass(cls)){            
        this.className = this.className.replace(cls,"");            
    }
};
// ..给某个子元素添加指定CLASS名同时删除所有兄弟元素的该class名
Element.prototype.addOnlyClass = function(cls){
    if(!this){
        return
    }
    if(!this.hasClass(cls)){
        var parent = this.parentNode;
        var brothers = parent.childNodes;
        brothers.forEach((item)=>{                    
            if(item.nodeType===1){
                item.removeClass(cls);
            }                    
        })
        this.addClass(cls);
    }else{
        return null;
    }
}