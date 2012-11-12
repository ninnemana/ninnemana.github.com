
var videos = '';
$(document).ready(function(){
    // Get the Flickr feed
    $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?id=37707146@N08&lang=en-us&format=json&jsoncallback=jsonFlickrFeed&callback=?',function(){},'jsonp');
    // Load videos
    loadYouTube();

    setTimeout('newTip()',8000);

    $('#audio').click(function(){
        resetContainers();
        if($('.player').find('#audioContainer').css('display') == 'none'){
            $('#audioContainer').slideDown();
        }
    });

    $('#video').click(function(){
        resetContainers();
        if($('.player').find('#videoContainer').css('display') == 'none'){
            $('#videoContainer').slideDown();
        }
    });

    $('#images').click(function(){
        resetContainers();
        if($('.player').find('#imageContainer').css('display') == 'none'){
            $('#imageContainer').slideDown();
        }
    });

    $('#content').click(function(){
        resetContainers();
    });

    $('#backgroundCanvas').click(function(){
        resetContainers();
    });

    var ytPlayers = $('#videoContainer').find('.content').find('object');
    $.each(ytPlayers,function(i,player){
        $(player).live('click',function(){
            console.log('click action....');
        });
    });
});

function onYouTubePlayerReady(playerID){
    var ytplayer = document.getElementById(playerID);
    ytplayer.addEventListener('onStateChange','ytplayerStateChange');
}

function ytplayerStateChange(newState){
    console.log('Players new state: ' + newState);
    if(newState == 1){
        this.pauseVideo();
    }
}

function getVideos(data){
    videos = data;
}

function loadYouTube(){
    var vids = videos.feed.entry || [];
    $.each(vids,function(i,video){
        var videoID = 'video' + i;
        $('#videoContainer').find('.content').append('<object id="'+videoID+'"></object>');
        var atts = {id: videoID};
        var params = {allowfullscreen: 'true', allowScriptAccess: 'always'};
        var youTubeID = video.id.$t.replace('http://gdata.youtube.com/feeds/videos/','');
        swfobject.embedSWF('http://www.youtube.com/v/'+youTubeID+'?enablejsapi=1&playerapiid='+videoID,videoID,'290','200','8',false,false,params,atts);
        
    });
}


function resetContainers(){
    $('#videoContainer').css('display','none');
    $('#audioContainer').css('display','none');
    $('#imageContainer').css('display','none');
}
var images = new Array()
function jsonFlickrFeed(data){
    $.each(data.items,function(i,item){
        if(i < 5){
            var imgHTML = '<div class="imgHolder">';
                imgHTML += '<img src="'+item.media.m+'" alt="'+item.title+'" /><br />';
                imgHTML += '<span>&nbsp;'+item.title+'</span>';
            imgHTML += '</div>';
            $('#imageContainer').find('.content').append(imgHTML);
        }
    });
}

function newTip(){
var tips = ['Click on the canvas and press <span style="text-decoration: underline">f</span> to increase brush size.' ,
 'Click on the canvas and press <span style="text-decoration: underline">d</span> to decrease brush size.'
]
$('#canvasTips').slideUp(function(){
    var tip = tips[Math.floor(Math.random() * tips.length)];
    $('#canvasTips').find('span').html(tip);
});

$('#canvasTips').slideDown();
setTimeout('newTip()',8000);
}


const FPS = 30;
var x = 0;
var y = 0;
var xDirection = 1;
var yDirection = 1;
var context2D = null;
var pageWidth = 1020;
var offset = 0;

function init()
{
    
	canvas = document.getElementById('imageCanvas');
        pageWidth = $('#topBar').width();
        $(canvas).attr('width',pageWidth);
	context2D = canvas.getContext('2d');
        setInterval(draw, 3000 / FPS);
	
}

function draw(image)
{
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        $.each(images,function(i,image){
            //var image = new Image();
            //image.src = img;
            //x +=  15;
            
            x += 0.1 * xDirection;
            context2D.drawImage(image, x - image.width, y);
            //y += 1 * yDirection;

            if (x >= pageWidth)
            {
                    x = pageWidth;
                    xDirection = -1;
            }
            else if (x <= 0)
            {
                    x = 0;
                    xDirection = 1;
            }
        });
}


