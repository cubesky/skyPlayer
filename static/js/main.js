var lyrics=undefined;
var lyricsValue=undefined;
var lyricstime=0;
var tlrc=undefined;
function windowRiz() {
  var wWidth=$(window).width();
  var wHeight=$(window).height();
  var plate=wWidth/4;
  var disk=wWidth*3/13;
  var disk_inside=wWidth/4/2;
  var title=plate+wHeight/10+25;
  var lrc=plate+wHeight/10+50+25;
  var btns=plate+wHeight/10+50+25+120+30;
  $('.container').css('height','100vh');
  $('.container-over').css('height','100vh');
  $('.back').css('height','100vh');
  $('.diskplate-down').css('width',plate);
  $('.diskplate-down').css('height',plate);
  $('.diskplate-down').css('left',(wWidth-plate)/2);
  $('.disk-show').attr('width',plate+1);
  $('.disk-show').attr('height',plate+1);
  $('.disk-show').attr('viewBox','0 0 '+(plate+1)+' '+(plate+1));
  $('.disk-show').css('left',(wWidth-plate)/2);
  $('.cir').attr('r',plate/2);
  $('.cir').attr('cx',plate/2);
  $('.cir').attr('cy',plate/2);
  $('.cirtra').attr('transform','matrix(0,-1,1,0,0,'+(plate)+')')
  $('.disk').css('width',disk);
  $('.disk').css('height',disk);
  $('.disk').css('left',(wWidth-disk)/2);
  $('.disk').css('top',(wHeight/10)+(plate-disk)/2);
  $('.disk-inside').css('width',disk_inside);
  $('.disk-inside').css('height',disk_inside);
  $('.disk-inside').css('left',(disk-disk_inside)/2);
  $('.disk-inside').css('top',(disk-disk_inside)/2);
  $('.title').css('top',title);
  $('.lrc').css('top',lrc);
  $('.control-btn').css('top',btns);
  $('.changeplay-btn').css('top',btns);
}

$('body').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
  $('.loadani').removeClass('loadani');
});

function progress(percent){
  var perimeter = Math.PI * 2 * ($(window).width()/4)/2;
  var circle = $('#disk-show')[0];
  circle.setAttribute('stroke-dasharray', perimeter * percent + " " + perimeter * (1- percent));
}

function change(){
  pause();
  if(tlrc !== undefined) {
    clearInterval(tlrc);
  }
  progress(0);
  $('#title').text('Loading....');
  $('#lrc').text('');
  $('#disk').addClass('disk-out').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    $('.disk-inside').css('background-color','white');
    $('#disk').hide();
    loaddata();
  });
}

function loaddata(){
    $.ajax({
        url:'/random',
        cache:false,
        dataType:'json',
        success: function(data){
            $('#disk').removeClass('disk-out');
            $('#players').attr('src',data.music);
            $('#title').text(data.title);
            $('#lrc').text('');
            lyrics=undefined;
            lyricsValue=undefined;
            if(data.lyrics === 'Music') {
              $('#lrc').text('纯音乐，请欣赏');
            } else if(data.lyrics === 'None') {
              $('#lrc').text('歌曲未提供歌词');
            } else {
              $.ajax({
                url:data.lyrics,
                cache:false,
                dataType:'json',
                success:function(lrcdata){
                    lyrics=[];
                    lyricsValue=[];
                    $('#lrc').text('');
                    for(var l in lrcdata) {
                      lyrics.push(Number(l));
                      lyricsValue.push(lrcdata[l]);
                    }
                },
                error:function(){
                    lyrics=undefined;
                    lyricsValue=undefined;
                    $('#lrc').text('歌词无法加载');
                }
              });
            }
            lyricstime=0;
            if(data.img === undefined) {
               $('#diskimg').css('background-color','');
               $('#diskimg').css('background-image','');
               $('#diskimg').attr('data-original','static/img/noimg.png');
            }else{
               $('#diskimg').css('background-color','');
               $('#diskimg').css('background-image', '');
               $('#diskimg').attr('data-original', data.img);
            }
            if(data.extra === undefined){
                $('#story').html('没有提供故事文本');
            }else{
                $('#story').html(data.extra);
            }

            $(".lazy").lazyload();
            $('#disk').addClass('disk-in');
            $('#disk').show();
            $('#disk').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
              $('#disk').removeClass('disk-in');
              play();
            });
        },
        error: function(){
            loaddata();
        }
    });
}

function play() {
  if($('#players').attr('src') === undefined){
     change();
  }
  $('#disk').addClass('disk-run');
  $('#players')[0].play();
}

function pause() {
  $('#disk').removeClass('disk-run');
  $('#players')[0].pause();
}

function render_lrc(element,nowlrc){
  if(tlrc !== undefined) {
    clearInterval(tlrc);
  }
  $('#lrc').text('');
  var lrcshow=[];
  for(var i in nowlrc){
    lrcshow.push(nowlrc[i]);
  }
  var lens=lrcshow.length-1;
  tlrc=setInterval(function(){
    $('#lrc').text(lrcshow[lens]+$('#lrc').text());
    lens=lens-1;
    if(lens<0){
      clearInterval(tlrc);
    }
  },20);
}

$(window).resize(function() {
  windowRiz();
});

$(document).ready(function(){
  windowRiz();
});

$('#change').click(function(){change();});

$('#players').on('ended', function(){change();});

$('#players').on('error', function(){change();});

$('#players').on('timeupdate',function(){
    var time=$('#players')[0].currentTime.toFixed(4);
    if(lyrics!==undefined){
        if(time>(lyrics[lyricstime])){
            render_lrc($('#lrc'),lyricsValue[lyricstime]);
            lyricstime++;
        }
    }
    progress(time/$('#players')[0].duration.toFixed(4));
});

$('#players').on('play', function(){
    $('#control').removeClass('fa-play');
    $('#control').addClass('fa-pause');
});

$('#players').on('pause', function(){
    $('#control').removeClass('fa-pause');
    $('#control').addClass('fa-play');
});

$('#control').click(function(){
    if($('#players')[0].paused){
        play();
    }else{
        pause();
    }
});

$('#changeplay').click(function(){
    change();
});



function filp_container() {
    $('#disk').unbind('click');
    $('#diskimg').unbind('click');
    $('.container').addClass('filp-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $('.container').removeClass('filp-container');
        $('.container').addClass('after-container');
        $('#container').on('click',function(){
          $('.container').removeClass('after-container');
          $('.container').addClass('return-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $('.container').removeClass('return-container');
            $('#container').unbind('click');
            $('.container').unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
            $('#disk').on('click',function(){
              filp_container();
            });
          });
        }); 
    });
}


var images = [];

function preload(list) {
  for (i = 0; i < list.length; i++) {
    images[i] = new Image();
    images[i].src = list[i];
  }
}

function startPreload() {
  swal({
    title: '正在预加载......',
    text: '请稍候',
    allowEscapeKey: false,
    allowEnterKey: false,
    allowOutsideClick: false,
    showConfirmButton: false
  });
  swal.showLoading();
  list = ['/static/img/background.png','/static/img/story.jpg','/static/img/noimg.png'];
  preload(list);
  $('.container').css('background-image','url(\'/static/img/background.png\')');
  $('.back').css('background-image','url(\'/static/img/story.jpg\')');
  setTimeout(function(){
    swal.hideLoading();
    swal.close();
  },1000);
}

startPreload();

$(document).ready(function(){
  $('#disk').on('click',function(){
    filp_container();
  });
})

/*
++++++++++[>++++++++++[>+>+>+>+>+>+>+>>+>+>>+>+>+>+>+>>+>+>+>+>+>+>+>>>+>+>+>+>+>>>>+>+>+>+>+>>+>+>+>+><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-]>-->+>++>>+>>>+++>-+>++>+++>---+>>++>>+>+++++>-->+>++>----+>>>>+>+>>++>++>+>+>++++++>+++++>+++++>+>>++>>+>+++++>>-+>++>>+<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-]>>.>+.>-.>+.>++++.>+.>.>++.>--.>+.>++.>----.>+++++.>+.>+++++.>.>---.>+++.>---.>+.>-.>.>+++.>+.>+++.>.>++++.>----.>----.>++.>+++++.>--.>---.>---.>--.>+++++.>+.>+++++.>.>----.>.>---.>----.>+.>.
*/