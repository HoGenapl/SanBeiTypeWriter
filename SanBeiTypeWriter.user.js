// ==UserScript==
// @name         SanBeiTypeWriter
// @namespace    http://tampermonkey.net/
// @version      0.5.3
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

//单词数量
var ward;
//是否打开了评论
var dkpl_gban = false;
//朗读单词辅助变量
var r_volume_words = true;
//转换完的字符标签
var cc;
//当前的字符指针位置
var cc_p=0;
//设置打字音
//音频文件1
var click;
//音频文件2
var click2;

//禁止空格下滑页面
window.onkeydown = function(){
    if (window.event.keyCode==32) {
        event.returnValue=false;
    }
}
//设置打字音
function set_sounds()
{
    try
    {
        click = new Audio("https://raw.githubusercontent.com/HoGenapl/SanBeiTypeWriter/main/click.wav");
        //click.loop = true;
        click.type = "audio/wav";
        click2 = new Audio("https://raw.githubusercontent.com/HoGenapl/SanBeiTypeWriter/main/beep.wav");
        //click.loop = true;
        click2.type = "audio/wav";
        return true;
    }
    catch(e)
    {
        return set_sounds();
    }
}

//绑定按键
function bind_keys()
{
    document.body.addEventListener("keydown",function(e){
        //播放按键声音
        if(sound_switch == true)
        {
            click.play();
        }
        //console.log("是否达到末尾",!(cc_p <= cc.length),"_键盘按键码:_",e.keyCode,"_需要按下的字符码:_",cc[cc_p].innerText.toUpperCase().charCodeAt(0))
        var kd = e.keyCode
        //$$(抛弃)转换单引号
        //if(kd == 222)
        //{
        //    kd = 39;
        //}
        //转换横杠
        if(kd == 189)
        {
            kd = 45;
        }
		//如果按下的是单引号则跳过...
        if((kd == 222) || (cc_p <= cc.length) && (kd == cc[cc_p].innerText.toUpperCase().charCodeAt(0)))
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
        //如果按下的是回车打开当前段落的评论
        else if(13 == kd)
        {
            if(dkpl_gban == false)//打开评论
            {
                cc[cc_p].parentNode.parentNode.parentNode.parentNode.getElementsByTagName("a")[0].click();
                dkpl_gban = true;
            }
            else{
                document.getElementsByClassName("notes-close-btn")[0].click();
                cc[cc_p+1].parentNode.click();
                dkpl_gban = false;
            }

        }
        //如果按下的是ESC键则关闭评论
        else if(27 == kd)
        {
            document.getElementsByClassName("notes-close-btn")[0].click();
            dkpl_gban = false;
        }
        //如果按错了播放提示音
        else if(sound_switch == true)
        {
            click2.play();
            //如果按错了,再播放一次单词声音
            if(sound_word == true)
            {
                r_volume_words = true;
            }
        }
        //播放单词声音
        if(sound_word == true)
        {
            //点开单词详解
            //如果是回车键则不打开单词详解,也不播放声音
            if(kd != 13)
            {
                cc[cc_p+1].parentNode.click();

                //点击播放声音
                if(r_volume_words == true)
                {
                    document.getElementsByClassName("volume")[0].click();
                }
            }
        }

    });
}

//***一下是一些我个人的调整用的舒服一点哈~***
//删除部分内容
//删除阅读栏右边内容
function init_delete1()
{
    try{
        document.getElementsByClassName("pull-right")[0].parentNode.removeChild(document.getElementsByClassName("pull-right")[0]);
        return true;
    }
    catch(e)
    {
        return init_delete1();
    }
}
//去除阅读内容的width
function init_delete2()
{
    try{
        document.getElementsByClassName("pull-left")[0].style.setProperty('width', 'initial');
        return true;
    }
    catch(e)
    {
        return init_delete2();
    }
}
//放大字体
function init_enlarge_font()
{
    try{
        document.getElementsByClassName("article-content")[0].style.setProperty("font-size","20px");
        return true;
    }
    catch(e)
    {
        return init_enlarge_font();
    }
}
function init_transform_words(word)
{
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
//***
//***^^^程序从这开始

//初始化开始
document.onreadystatechange = function() {
    if (document.readyState == "complete"){

        var start_timer = setInterval(function(word){
            //异步,防止Dom元素未出现
            //先隐藏文章等待初始化完毕
            //如果是短文首页不隐藏
            //console.log(window.location.href);
            if(window.location.href != "https://web.shanbay.com/reading/web-news/articles")
            {
                document.getElementsByClassName("app-main")[0].style.display="none";
            }

            word = document.getElementsByClassName("word");

            if(word.length != 0 && init_delete1() && init_delete2() && init_enlarge_font() && set_sounds())
            {
                clearInterval(start_timer);
                bind_keys();
                init_transform_words(word);
                //显示文章
                document.getElementsByClassName("app-main")[0].style.display="block";
                //滚轮移动到最顶部
                document.body.scrollTop=document.documentElement.scrollTop=0
                console.log("初始化完毕");
            }



        }
                                      ,500);
    }
};