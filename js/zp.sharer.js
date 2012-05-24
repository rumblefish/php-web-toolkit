/*
 Rumblefish Web Toolkit (PHP)
 
 Copyright 2012 Rumblefish, Inc.
 
 Licensed under the Apache License, Version 2.0 (the "License"); you may
 not use this file except in compliance with the License. You may obtain
 a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations
 under the License.
 
 Use of the Rumblefish Sandbox in connection with this file is governed by
 the Sandbox Terms of Use found at https://sandbox.rumblefish.com/agreement
 
 Use of the Rumblefish API for any commercial purpose in connection with
 this file requires a written agreement with Rumblefish, Inc.
 */


(function($){
    $.fn.zpsharer=function(options){
        var defaults={
            trigger:"click",
            direction:"clockwise",
            duration:750,
            zIndex:80000,
            widthMultiplier:1.3
        };
        
        var sets=$.extend({},defaults,options);
        return this.each(function(){
            var $t=$(this),w=$t.width(),h=$t.height(),parent=$t.find("ul"),list=parent.find("li"),size=list.length,hov=false,dir;
            if(sets.direction=="clockwise"){
                dir=-1
            }else{
                if(sets.direction=="counter"){
                    dir=1
                }
            }
            var socials={
                init:function(){
                    parent.hide().css({
                        zIndex:sets.zIndex
                    });
                    $t.append($("<a />").addClass("trigger").css({
                        display:"block",
                        position:"absolute",
                        zIndex:1,
                        top:0,
                        left:0,
                        width:"100%",
                        height:"100%"
                    }));
                    switch(sets.trigger){
                        case"click":
                            socials.click();
                            break;
                        case"hover":
                            socials.hover();
                            break;
                        default:
                            socials.click()
                    }
                },
                click:function(){
                    var trigger=$t.find("a.trigger");
                    trigger.bind("click",function(){
                        if($t.hasClass("close")){
                            parent.fadeTo(sets.duration,0);
                            socials.animation.close();
                            $t.removeClass("close")
                        }else{
                            parent.fadeTo(sets.duration,1);
                            socials.animation.open();
                            //CRAIG - close all other instances
                            $('.zpsocials.close > a.trigger').trigger('click');
                            $t.addClass("close")
                        }
                        return false
                    })
                },
                hover:function(){
                    var trigger=$t.find("a.trigger");
                    trigger.bind("mouseover",function(){
                        if(hov==false){
                            parent.fadeTo(sets.duration,1);
                            socials.animation.open();
                            $t.addClass("close")
                        }
                    });
                    parent.bind("mouseleave",function(){
                        $t.removeClass("close");
                        parent.fadeTo(sets.duration,0);
                        socials.animation.close();
                        hov=true;
                        setTimeout(function(){
                            hov=false
                        },500)
                    })
                },
                animation:{
                    open:function(){
                        socials.ie.open();
                        list.each(function(i){
                            var li=$(this);
                            li.css({
                                zIndex:sets.zIndex+2
                            }).siblings("li").css({
                                zIndex:sets.zIndex+4
                            })
                            li.animate({
                                path:new $.path.arc({
                                    center:[0,0],
                                    radius:w*sets.widthMultiplier,
                                    start:0,
                                    end:360/size*i,
                                    dir:dir
                                })
                            },sets.duration)
                        });
                        list.hover(function(){
                            var li=$(this);
                            li.css({
                                zIndex:sets.zIndex+2
                            }).siblings("li").css({
                                zIndex:sets.zIndex+4
                            })
                        })
                    },
                    close:function(){
                        list.each(function(i){
                            var li=$(this);
                            li.animate({
                                top:0,
                                left:0
                            },sets.duration,function(){
                                socials.ie.close()
                            })
                        })
                    }
                },
                ie:{
                    open:function(){
                        if($.browser.msie){
                            list.show()
                        }
                    },
                    close:function(){
                        if($.browser.msie){
                            list.hide()
                        }
                    }
                }
            };

            socials.init()
        })
    }
}(jQuery));
(function($){
    $.path={};
    
    $.path.arc=function(params){
        for(var i in params){
            this[i]=params[i]
        }
        this.dir=this.dir||1;
        while(this.start>this.end&&this.dir>0){
            this.start-=360
        }while(this.start<this.end&&this.dir<0){
            this.start+=360
        }
        this.css=function(p){
            var a=this.start*(p)+this.end*(1-(p));
            a=a*3.1415927/180;
            var x=Math.sin(a)*this.radius+this.center[0];
            var y=Math.cos(a)*this.radius+this.center[1];
            return{
                top:y+"px",
                left:x+"px"
            }
        }
    };

    $.fx.step.path=function(fx){
        var css=fx.end.css(1-fx.pos);
        for(var i in css){
            fx.elem.style[i]=css[i]
        }
    }
})(jQuery);
