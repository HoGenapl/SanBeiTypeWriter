// ==UserScript==
// @name         SanBeiTypeWriter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  扇贝阅读打字记忆 见https://github.com/HoGenapl/SanBeiTypeWriter
// @author       Hogen
// @match        https://web.shanbay.com/reading/web-news/articles*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shanbay.com
// @grant        none
// @run-at document-end
// ==/UserScript==
//设置
//1.打字声音是否开启
var sound_switch = true;
//2.单词声音是否开启
var sound_word = true;

//朗读单词辅助变量
var r_volume_words = true;
//转换完的字符标签
var cc;
//当前的字符指针位置
var cc_p=0;
//设置打字音
//添加音频文件1
const click = new Audio("https://raw.githubusercontent.com/HoGenapl/SanBeiTypeWriter/main/click.wav");
//click.loop = true;
click.type = "audio/wav";
//添加音频文件2
const click2 = new Audio("https://raw.githubusercontent.com/HoGenapl/SanBeiTypeWriter/main/beep.wav");
//click.loop = true;
click2.type = "audio/wav";
//禁止空格下滑页面
window.onkeydown = function(){
    if (window.event.keyCode==32) {
        event.returnValue=false;
    }
}
//绑定按键
document.body.addEventListener("keydown",function(e){
    //播放按键声音
    if(sound_switch == true)
    {
        click.play();
    }
    console.log(cc_p <= cc.length,"_键盘按键码:_",e.keyCode,"_需要按下的字符码:_",cc[cc_p].innerText.toUpperCase().charCodeAt(0))
    var kd = e.keyCode
    //转换单引号
    if(kd == 222)
    {
        kd = 39;
    }
    //转换横杠
    else if(kd == 189)
    {
        kd = 45;
    }
    if((cc_p <= cc.length) && (kd == cc[cc_p].innerText.toUpperCase().charCodeAt(0)))
    {
        cc[cc_p].style.color="red";
        //如果下一个是空格
        if(cc[cc_p + 1].innerText == " ")
        {
            cc[cc_p].style.color="black";
        }
        //如果是空格,表示下一个是新单词;
        if(cc[cc_p].innerText == " ")
        {
            r_volume_words = true;
            cc[cc_p - 1].style.color="red";
        }
        else
        {
            r_volume_words = false;
        }
        cc_p = cc_p + 1;
    }
    else if(sound_switch == true)//如果按错了播放提示音
    {
        click2.play();
        //如果按错了,再播放一次单词声音
        if(sound_word == true)
        {
            r_volume_words = true;
            console.log("ee");
        }
    }
    //console.log(cc_p,"__",cc.length);
    //播放单词声音
    if(sound_word == true)
    {
        //点开单词详解
        cc[cc_p+1].parentNode.click();
        console.log("r_volume_words",r_volume_words);
        //点击播放声音
        if(r_volume_words == true)
        {
            document.getElementsByClassName("volume")[0].click();
            console.log(r_volume_words);
        }
    }

});

document.onreadystatechange = function() {
    if (document.readyState == "complete"){
        //等待1秒,防止Dom元素未出现
        //***一下是一些我个人的调整用的舒服一点哈~***
        //删除部分内容
        //删除阅读栏右边内容
        document.getElementsByClassName("pull-right")[0].parentNode.removeChild(document.getElementsByClassName("pull-right")[0]);
        //去除阅读内容的width
        document.getElementsByClassName("pull-left")[0].style.setProperty('width', 'initial');
        //放大字体
        document.getElementsByClassName("article-content")[0].style.setProperty("font-size","20px");

        //***

        var start_timer = setInterval(function(){
            let word = document.getElementsByClassName("word");
            if(word.length != 0)
            {
                clearInterval(start_timer);
            }
            //单词数量
            console.log("words:",word.length);
            for(var i=0,len = word.length;i<len;i++)
            {
                //console.log(word[i]);

                //开始转换,将单词转换为单个的元素
                let a = word[i];
                let b = a.innerText;
                //console.log(a.innerText);
                //清除内容
                a.innerText = '';
                for(var j in b)
                {
                    //console.log(b[j]);
                    var e = document.createElement("span");
                    e.innerText = b[j];
                    e.style.color="blue";
                    e.setAttribute("class","wds");
                    a.appendChild(e);
                }
                //最后添加一个不可见的空格
                e = document.createElement("span");
                e.innerText = " ";
                e.setAttribute("class","wds");
                e.setAttribute("style","display:none");
                a.appendChild(e);
            }
            //获取所有的转换完的字符标签
            //
            cc = document.getElementsByClassName("wds");


        }
                                      ,100);
    }
};