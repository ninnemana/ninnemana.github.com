
(function(window,document,undefined){

    /* Ribbon Brush */
    function ribbon( context )
    {
        this.init( context );
    }
    ribbon.prototype = {
        context: null,

        mouseX: null, 
        mouseY: null,

        painters: null,

        interval: null,

        init: function( context )
        {
            this.context = context;
            this.context.globalCompositeOperation = 'source-over';

            this.mouseX = SCREEN_WIDTH / 2;
            this.mouseY = SCREEN_HEIGHT / 2;

            this.painters = new Array();

            for (var i = 0; i < 50; i++)
            {
                this.painters.push({
                    dx: SCREEN_WIDTH / 2, 
                    dy: SCREEN_HEIGHT / 2, 
                    ax: 0, 
                    ay: 0, 
                    div: 0.1, 
                    ease: Math.random() * 0.2 + 0.6
                });
            }

            this.isDrawing = false;

            this.interval = setInterval( bargs( function( _this ) {
                _this.update();
                return false;
            }, this ), 1000/60 );
        },

        destroy: function()
        {
            clearInterval(this.interval);
        },

        strokeStart: function( mouseX, mouseY )
        {
            this.mouseX = mouseX;
            this.mouseY = mouseY
            this.context.lineWidth = BRUSH_SIZE;
            this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.05 )";		

            for (var i = 0; i < this.painters.length; i++)
            {
                this.painters[i].dx = mouseX;
                this.painters[i].dy = mouseY;
            }

            this.shouldDraw = true;
        },

        stroke: function( mouseX, mouseY )
        {
            this.mouseX = mouseX;
            this.mouseY = mouseY;
        },

        strokeEnd: function()
        {

        },

        update: function()
        {
            var i;

            for (i = 0; i < this.painters.length; i++)
            {
                this.context.beginPath();
                this.context.moveTo(this.painters[i].dx, this.painters[i].dy);		

                this.painters[i].dx -= this.painters[i].ax = (this.painters[i].ax + (this.painters[i].dx - this.mouseX) * this.painters[i].div) * this.painters[i].ease;
                this.painters[i].dy -= this.painters[i].ay = (this.painters[i].ay + (this.painters[i].dy - this.mouseY) * this.painters[i].div) * this.painters[i].ease;
                this.context.lineTo(this.painters[i].dx, this.painters[i].dy);
                this.context.stroke();
            }
        }
    }
    
    /* Chrome Brush */
    function chrome( context ){
        this.init( context );
    }
    chrome.prototype = {
        context: null,

        prevMouseX: null, 
        prevMouseY: null,

        points: null, 
        count: null,

        init: function( context )
        {
            this.context = context;
            this.context.lineWidth = 1;

            if (RegExp(" AppleWebKit/").test(navigator.userAgent))
                this.context.globalCompositeOperation = 'darker';

            this.points = new Array();
            this.count = 0;
        },

        destroy: function()
        {
        },

        strokeStart: function( mouseX, mouseY )
        {
            this.prevMouseX = mouseX;
            this.prevMouseY = mouseY;
        },

        stroke: function( mouseX, mouseY )
        {
            var i, dx, dy, d;

            this.points.push( [ mouseX, mouseY ] );

            this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.1)";
            this.context.beginPath();
            this.context.moveTo(this.prevMouseX, this.prevMouseY);
            this.context.lineTo(mouseX, mouseY);
            this.context.stroke();

            for (i = 0; i < this.points.length; i++)
            {
                dx = this.points[i][0] - this.points[this.count][0];
                dy = this.points[i][1] - this.points[this.count][1];
                d = dx * dx + dy * dy;

                if (d < 1000)
                {
                    this.context.strokeStyle = "rgba(" + Math.floor(Math.random() * COLOR[0]) + ", " + Math.floor(Math.random() * COLOR[1]) + ", " + Math.floor(Math.random() * COLOR[2]) + ", 0.1 )";
                    this.context.beginPath();
                    this.context.moveTo( this.points[this.count][0] + (dx * 0.2), this.points[this.count][1] + (dy * 0.2));
                    this.context.lineTo( this.points[i][0] - (dx * 0.2), this.points[i][1] - (dy * 0.2));
                    this.context.stroke();
                }
            }

            this.prevMouseX = mouseX;
            this.prevMouseY = mouseY;

            this.count ++;
        },

        strokeEnd: function()
        {

        }
    }

    /* Fur Brush */
    function fur( context )
    {
            this.init( context );
    }
    fur.prototype = {
            context: null,

            prevMouseX: null, prevMouseY: null,

            points: null, count: null,

            init: function( context )
            {
                    this.context = context;
                    this.context.lineWidth = 1;

                    this.points = new Array();
                    this.count = 0;
            },

            destroy: function()
            {
            },

            strokeStart: function( mouseX, mouseY )
            {
                    this.prevMouseX = mouseX;
                    this.prevMouseY = mouseY;

                    this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.1)";		
            },

            stroke: function( mouseX, mouseY )
            {
                    var i, dx, dy, d;

                    this.points.push( [ mouseX, mouseY ] );

                    this.context.beginPath();
                    this.context.moveTo(this.prevMouseX, this.prevMouseY);
                    this.context.lineTo(mouseX, mouseY);
                    this.context.stroke();

                    for (i = 0; i < this.points.length; i++)
                    {
                            dx = this.points[i][0] - this.points[this.count][0];
                            dy = this.points[i][1] - this.points[this.count][1];
                            d = dx * dx + dy * dy;

                            if (d < 2000 && Math.random() > d / 2000)
                            {
                                    this.context.beginPath();
                                    this.context.moveTo( mouseX + (dx * 0.5), mouseY + (dy * 0.5));
                                    this.context.lineTo( mouseX - (dx * 0.5), mouseY - (dy * 0.5));
                                    this.context.stroke();
                            }
                    }

                    this.prevMouseX = mouseX;
                    this.prevMouseY = mouseY;

                    this.count ++;
            },

            strokeEnd: function()
            {

            }
    }

    /* Grid Brush */
    function grid( context ){
	this.init( context );
    }
    grid.prototype = {
	context: null,

	init: function( context )
	{
		this.context = context;
		this.context.lineWidth = 1;

		if (RegExp(" AppleWebKit/").test(navigator.userAgent))
			this.context.globalCompositeOperation = 'darker';
	},

	destroy: function()
	{
	},

	strokeStart: function( mouseX, mouseY )
	{
		this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.01)";	
	},

	stroke: function( mouseX, mouseY )
	{
		var i, cx, cy, dx, dy;
		
		cx = Math.round(mouseX / 100) * 100;
		cy = Math.round(mouseY / 100) * 100;
		
		dx = (cx - mouseX) * 10;
		dy = (cy - mouseY) * 10;

		for (i = 0; i < 50; i++)
		{
			this.context.beginPath();
			this.context.moveTo( cx, cy );
			this.context.quadraticCurveTo(mouseX + Math.random() * dx, mouseY + Math.random() * dy, cx, cy);
			this.context.stroke();
		}
	},

	strokeEnd: function()
	{
		
	}
}


    /* Long Fur Brush */
    function longfur( context ){
	this.init( context );
    }
    longfur.prototype = {
            context: null,

            points: null, count: null,

            init: function( context )
            {
                    this.context = context;
                    this.context.lineWidth = 1;
                    this.context.globalCompositeOperation = 'source-over';

                    this.points = new Array();
                    this.count = 0;
            },

            destroy: function()
            {
            },

            strokeStart: function( mouseX, mouseY )
            {
                    this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.05 )";	
            },

            stroke: function( mouseX, mouseY )
            {
                    var i, size, dx, dy, d;

                    this.points.push( [ mouseX, mouseY ] );

                    for (i = 0; i < this.points.length; i++)
                    {
                            size = -Math.random();
                            dx = this.points[i][0] - this.points[this.count][0];
                            dy = this.points[i][1] - this.points[this.count][1];
                            d = dx * dx + dy * dy;

                            if (d < 4000 && Math.random() > d / 4000)
                            {
                                    this.context.beginPath();
                                    this.context.moveTo( this.points[this.count][0] + (dx * size), this.points[this.count][1] + (dy * size));
                                    this.context.lineTo( this.points[i][0] - (dx * size) + Math.random() * 2, this.points[i][1] - (dy * size) + Math.random() * 2);
                                    this.context.stroke();
                            }
                    }

                    this.count ++;
            },

            strokeEnd: function()
            {

            }
    }
    
    /* Shaded Brush */
    function shaded( context ){
	this.init( context );
    }
    shaded.prototype = {
            context: null,

            prevMouseX: null, prevMouseY: null,

            points: null, count: null,

            init: function( context )
            {
                    this.context = context;
                    this.context.lineWidth = 1;
                    this.context.globalCompositeOperation = 'source-over';

                    this.points = new Array();
                    this.count = 0;
            },

            destroy: function()
            {
            },

            strokeStart: function( mouseX, mouseY )
            {
                    this.prevMouseX = mouseX;
                    this.prevMouseY = mouseY;
            },

            stroke: function( mouseX, mouseY )
            {
                    var i, dx, dy, d;

                    this.points.push( [ mouseX, mouseY ] );

                    for (i = 0; i < this.points.length; i++)
                    {
                            dx = this.points[i][0] - this.points[this.count][0];
                            dy = this.points[i][1] - this.points[this.count][1];
                            d = dx * dx + dy * dy;

                            if (d < 1000)
                            {
                                    this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", " + ((1 - (d / 1000)) * 0.1) + " )";

                                    this.context.beginPath();
                                    this.context.moveTo( this.points[this.count][0], this.points[this.count][1]);
                                    this.context.lineTo( this.points[i][0], this.points[i][1]);
                                    this.context.stroke();
                            }
                    }

                    this.prevMouseX = mouseX;
                    this.prevMouseY = mouseY;

                    this.count ++;
            },

            strokeEnd: function()
            {

            }
    }
    
    /* Simple Brush */
    function simple( context ){
        this.init( context );
    }
    simple.prototype = {
        context: null,

        prevMouseX: null, prevMouseY: null,

        init: function( context )
        {
                this.context = context;
                this.context.globalCompositeOperation = 'source-over';
                this.context.lineWidth = 0.5;
        },

        destroy: function()
        {
        },

        strokeStart: function( mouseX, mouseY )
        {
                this.prevMouseX = mouseX;
                this.prevMouseY = mouseY;

                this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.5)";		
        },

        stroke: function( mouseX, mouseY )
        {
                this.context.beginPath();
                this.context.moveTo(this.prevMouseX, this.prevMouseY);
                this.context.lineTo(mouseX, mouseY);
                this.context.stroke();

                this.prevMouseX = mouseX;
                this.prevMouseY = mouseY;
        },

        strokeEnd: function()
        {

        }
    }
    
    /* Sketchy Brush */
    function sketchy( context ){
        this.init( context );
    }
    sketchy.prototype = {
        context: null,

        prevMouseX: null, prevMouseY: null,

        points: null, count: null,

        init: function( context )
        {
                this.context = context;
                this.context.lineWidth = 1;
                this.context.globalCompositeOperation = 'source-over';

                this.points = new Array();
                this.count = 0;
        },

        destroy: function()
        {
        },

        strokeStart: function( mouseX, mouseY )
        {
                this.prevMouseX = mouseX;
                this.prevMouseY = mouseY;
        },

        stroke: function( mouseX, mouseY )
        {
                var i, dx, dy, d;

                this.points.push( [ mouseX, mouseY ] );

                this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.05)";
                this.context.beginPath();
                this.context.moveTo(this.prevMouseX, this.prevMouseY);
                this.context.lineTo(mouseX, mouseY);
                this.context.stroke();

                this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.05 )";

                for (i = 0; i < this.points.length; i++)
                {
                        dx = this.points[i][0] - this.points[this.count][0];
                        dy = this.points[i][1] - this.points[this.count][1];
                        d = dx * dx + dy * dy;

                        if (d < 4000 && Math.random() > d / 2000)
                        {
                                this.context.beginPath();
                                this.context.moveTo( this.points[this.count][0] + (dx * 0.3), this.points[this.count][1] + (dy * 0.3));
                                this.context.lineTo( this.points[i][0] - (dx * 0.3), this.points[i][1] - (dy * 0.3));
                                this.context.stroke();
                        }
                }

                this.prevMouseX = mouseX;
                this.prevMouseY = mouseY;

                this.count ++;
        },

        strokeEnd: function()
        {

        }
    }

    /* Web Brush */
    function web( context ){
        this.init( context );
    }
    web.prototype = {
        context: null,

        prevMouseX: null, prevMouseY: null,

        points: null, count: null,

        init: function( context )
        {
                this.context = context;
                this.context.lineWidth = 1;
                this.context.globalCompositeOperation = 'source-over';

                this.points = new Array();
                this.count = 0;
        },

        destroy: function()
        {
        },

        strokeStart: function( mouseX, mouseY )
        {
                this.prevMouseX = mouseX;
                this.prevMouseY = mouseY;
        },

        stroke: function( mouseX, mouseY )
        {
                var i, dx, dy, d;

                this.points.push( [ mouseX, mouseY ] );

                this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.5)";
                this.context.beginPath();
                this.context.moveTo(this.prevMouseX, this.prevMouseY);
                this.context.lineTo(mouseX, mouseY);
                this.context.stroke();

                this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.1)";

                for (i = 0; i < this.points.length; i++)
                {
                        dx = this.points[i][0] - this.points[this.count][0];
                        dy = this.points[i][1] - this.points[this.count][1];
                        d = dx * dx + dy * dy;

                        if (d < 2500 && Math.random() > 0.9)
                        {
                                this.context.beginPath();
                                this.context.moveTo( this.points[this.count][0], this.points[this.count][1]);
                                this.context.lineTo( this.points[i][0], this.points[i][1]);
                                this.context.stroke();
                        }
                }

                this.prevMouseX = mouseX;
                this.prevMouseY = mouseY;

                this.count ++;
        },

        strokeEnd: function()
        {

        }
    }
    
    
    function bargs( _fn )
    {
        var n, args = [];
        for( n = 1; n < arguments.length; n++ )
            args.push( arguments[ n ] );
        return function () {
            return _fn.apply( this, args );
        };
    }
    
    
/*function Palette()
{
	var canvas, context, offsetx, offsety, radius = 90,
	count = 1080, oneDivCount = 1 / count, countDiv360 = count / 360, degreesToRadians = Math.PI / 180,
	i, angle, angle_cos, angle_sin, gradient;

	canvas = document.getElementById("backgroundCanvas");
	canvas.width = 250;
	canvas.height = 250;

	offsetx = canvas.width / 2;
	offsety = canvas.height / 2;

	context = canvas.getContext("2d");
	context.lineWidth = 1;

	// http://www.boostworthy.com/blog/?p=226

	for(i = 0; i < count; i++)
	{
		angle = i / countDiv360 * degreesToRadians;
		angle_cos = Math.cos(angle);
		angle_sin = Math.sin(angle);

		context.strokeStyle = "hsl(" + Math.floor( (i * oneDivCount) * 360 ) + ", 100%, 50%)";
		context.beginPath();
		context.moveTo(angle_cos + offsetx, angle_sin + offsety);
		context.lineTo(angle_cos * radius + offsetx, angle_sin * radius + offsety);
		context.stroke();
	}

	gradient = context.createRadialGradient(offsetx, offsetx, 0, offsetx, offsetx, radius);
	gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
	gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

	context.fillStyle = gradient;
	context.fillRect(0, 0, canvas.width, canvas.height);

	return canvas;
}*/

var REV = 6,
       //BRUSHES = ["sketchy", "shaded", "chrome", "fur", "longfur", "web", "", "simple", "squares", "ribbon", "", "circles", "grid"],
       BRUSHES = ["ribbon","chrome","fur","grid","longfur","shaded","simple","sketchy","web"];
       USER_AGENT = navigator.userAgent.toLowerCase();

var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight,
    BRUSH_SIZE = 1,
    BRUSH_PRESSURE = 10,
    COLOR = [255, 255, 255],
    BACKGROUND_COLOR = [250, 250, 250],
    STORAGE = window.localStorage,
    brush,
    saveTimeOut,
    wacom,
    i,
    mouseX = 0,
    mouseY = 0,
    container,
    foregroundColorSelector,
    backgroundColorSelector,
    menu,
    about,
    canvas,
    flattenCanvas,
    context,
    isFgColorSelectorVisible = false,
    isBgColorSelectorVisible = false,
    isAboutVisible = false,
    isMenuMouseOver = false,
    shiftKeyIsDown = false,
    altKeyIsDown = false;

init();

function init()
{
	var hash, embed, localStorageImage;

	if (USER_AGENT.search("android") > -1 || USER_AGENT.search("iphone") > -1)
		BRUSH_SIZE = 2;	

	if (USER_AGENT.search("safari") > -1 && USER_AGENT.search("chrome") == -1) // Safari
		STORAGE = false;

	document.body.style.backgroundRepeat = 'no-repeat';
	document.body.style.backgroundPosition = 'center center';	

	//container = document.createElement('div');
        container = document.getElementById('container');
	//document.body.appendChild(container);

	/*
	 * TODO: In some browsers a naste "Plugin Missing" window appears and people is getting confused.
	 * Disabling it until a better way to handle it appears.
	 * 
	 * embed = document.createElement('embed');
	 * embed.id = 'wacom-plugin';
	 * embed.type = 'application/x-wacom-tablet';
	 * document.body.appendChild(embed);
	 *
	 * wacom = document.embeds["wacom-plugin"];
	 */

	//canvas = document.createElement("canvas");
        canvas = document.getElementById('backgroundCanvas');
	canvas.width = SCREEN_WIDTH;
	canvas.height = SCREEN_HEIGHT;
	canvas.style.cursor = 'crosshair';
	container.appendChild(canvas);

	context = canvas.getContext("2d");

	flattenCanvas = document.createElement("canvas");
	flattenCanvas.width = SCREEN_WIDTH;
	flattenCanvas.height = SCREEN_HEIGHT;

	//palette = new Palette();

	//foregroundColorSelector = new ColorSelector(palette);
	//foregroundColorSelector.addEventListener('change', onForegroundColorSelectorChange, false);
	//container.appendChild(foregroundColorSelector.container);

	//backgroundColorSelector = new ColorSelector(palette);
	//backgroundColorSelector.addEventListener('change', onBackgroundColorSelectorChange, false);
	//container.appendChild(backgroundColorSelector.container);	

	/*menu = new Menu();
	menu.foregroundColor.addEventListener('click', onMenuForegroundColor, false);
	menu.foregroundColor.addEventListener('touchend', onMenuForegroundColor, false);
	menu.backgroundColor.addEventListener('click', onMenuBackgroundColor, false);
	menu.backgroundColor.addEventListener('touchend', onMenuBackgroundColor, false);
	menu.selector.addEventListener('change', onMenuSelectorChange, false);
	menu.save.addEventListener('click', onMenuSave, false);
	menu.save.addEventListener('touchend', onMenuSave, false);
	menu.clear.addEventListener('click', onMenuClear, false);
	menu.clear.addEventListener('touchend', onMenuClear, false);
	menu.about.addEventListener('click', onMenuAbout, false);
	menu.about.addEventListener('touchend', onMenuAbout, false);
	menu.container.addEventListener('mouseover', onMenuMouseOver, false);
	menu.container.addEventListener('mouseout', onMenuMouseOut, false);
	container.appendChild(menu.container);*/

	if (STORAGE)
	{
		if (localStorage.canvas)
		{
			localStorageImage = new Image();

			localStorageImage.addEventListener("load", function(event)
			{
				localStorageImage.removeEventListener(event.type, arguments.callee, false);
				context.drawImage(localStorageImage,0,0);
			}, false);

			localStorageImage.src = localStorage.canvas;			
		}

		if (localStorage.brush_color_red)
		{
			COLOR[0] = localStorage.brush_color_red;
			COLOR[1] = localStorage.brush_color_green;
			COLOR[2] = localStorage.brush_color_blue;
		}

		if (localStorage.background_color_red)
		{
			BACKGROUND_COLOR[0] = localStorage.background_color_red;
			BACKGROUND_COLOR[1] = localStorage.background_color_green;
			BACKGROUND_COLOR[2] = localStorage.background_color_blue;
		}
	}

	//foregroundColorSelector.setColor( COLOR );
	//backgroundColorSelector.setColor( BACKGROUND_COLOR );

	if (window.location.hash)
	{
		hash = window.location.hash.substr(1,window.location.hash.length);

		for (i = 0; i < BRUSHES.length; i++)
		{
			if (hash == BRUSHES[i])
			{
				brush = eval("new " + BRUSHES[i] + "(context)");
				//menu.selector.selectedIndex = i;
				break;
			}
		}
	}

	if (!brush)
	{
		brush = eval("new " + BRUSHES[0] + "(context)");
	}

	/*about = new About();
	container.appendChild(about.container);*/

	window.addEventListener('mousemove', onWindowMouseMove, false);
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keydown', onWindowKeyDown, false);
	window.addEventListener('keyup', onWindowKeyUp, false);
	window.addEventListener('blur', onWindowBlur, false);

	//document.addEventListener('mousedown', onDocumentMouseDown, false);
	//document.addEventListener('mouseout', onDocumentMouseOut, false);

	document.addEventListener("dragenter", onDocumentDragEnter, false);  
	document.addEventListener("dragover", onDocumentDragOver, false);
	document.addEventListener("drop", onDocumentDrop, false);  

	canvas.addEventListener('mousedown', onCanvasMouseDown, false);
	canvas.addEventListener('touchstart', onCanvasTouchStart, false);

	//onWindowResize(null);
}


// WINDOW

function onWindowMouseMove( event )
{
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function onWindowResize()
{
	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;

	//menu.container.style.left = ((SCREEN_WIDTH - menu.container.offsetWidth) / 2) + 'px';

	//about.container.style.left = ((SCREEN_WIDTH - about.container.offsetWidth) / 2) + 'px';
	//about.container.style.top = ((SCREEN_HEIGHT - about.container.offsetHeight) / 2) + 'px';
}

function onWindowKeyDown( event )
{
	if (shiftKeyIsDown)
		return;

	switch(event.keyCode)
	{
		case 16: // Shift
			shiftKeyIsDown = true;
			foregroundColorSelector.container.style.left = mouseX - 125 + 'px';
			foregroundColorSelector.container.style.top = mouseY - 125 + 'px';
			foregroundColorSelector.container.style.visibility = 'visible';
			break;

		case 18: // Alt
			altKeyIsDown = true;
			break;

		case 68: // d
			if(BRUSH_SIZE > 1) BRUSH_SIZE --;
			break;

		case 70: // f
			BRUSH_SIZE ++;
			break;			
	}
}

function onWindowKeyUp( event )
{
	switch(event.keyCode)
	{
		case 16: // Shift
			shiftKeyIsDown = false;
			foregroundColorSelector.container.style.visibility = 'hidden';			
			break;

		case 18: // Alt
			altKeyIsDown = false;
			break;

		case 82: // r
			brush.destroy();
			brush = eval("new " + BRUSHES[menu.selector.selectedIndex] + "(context)");
			break;
		case 66: // b
			document.body.style.backgroundImage = null;
			break;
	}

	context.lineCap = BRUSH_SIZE == 1 ? 'butt' : 'round';	
}

function onWindowBlur( event )
{
	shiftKeyIsDown = false;
	altKeyIsDown = false;
}

// DOCUMENT

function onDocumentMouseDown( event )
{
    alert('asd;fjafea');
	if (!isMenuMouseOver)
		event.preventDefault();
}

function onDocumentMouseOut( event )
{
	onCanvasMouseUp();
}

function onDocumentDragEnter( event )
{
	event.stopPropagation();
	event.preventDefault();
}

function onDocumentDragOver( event )
{
	event.stopPropagation();
	event.preventDefault();
}

function onDocumentDrop( event )
{
	event.stopPropagation();  
	event.preventDefault();

	var file = event.dataTransfer.files[0];

	if (file.type.match(/image.*/))
	{
		/*
		 * TODO: This seems to work on Chromium. But not on Firefox.
		 * Better wait for proper FileAPI?
		 */

		var fileString = event.dataTransfer.getData('text').split("\n");
		document.body.style.backgroundImage = 'url(' + fileString[0] + ')';
	}	
}


// COLOR SELECTORS

function onForegroundColorSelectorChange( event )
{
	COLOR = foregroundColorSelector.getColor();

	menu.setForegroundColor( COLOR );

	if (STORAGE)
	{
		localStorage.brush_color_red = COLOR[0];
		localStorage.brush_color_green = COLOR[1];
		localStorage.brush_color_blue = COLOR[2];		
	}
}

function onBackgroundColorSelectorChange( event )
{
	BACKGROUND_COLOR = backgroundColorSelector.getColor();

	menu.setBackgroundColor( BACKGROUND_COLOR );

	document.body.style.backgroundColor = 'rgb(' + BACKGROUND_COLOR[0] + ', ' + BACKGROUND_COLOR[1] + ', ' + BACKGROUND_COLOR[2] + ')';

	if (STORAGE)
	{
		localStorage.background_color_red = BACKGROUND_COLOR[0];
		localStorage.background_color_green = BACKGROUND_COLOR[1];
		localStorage.background_color_blue = BACKGROUND_COLOR[2];				
	}
}


// MENU

function onMenuForegroundColor()
{
	cleanPopUps();

	foregroundColorSelector.show();
	foregroundColorSelector.container.style.left = ((SCREEN_WIDTH - foregroundColorSelector.container.offsetWidth) / 2) + 'px';
	foregroundColorSelector.container.style.top = ((SCREEN_HEIGHT - foregroundColorSelector.container.offsetHeight) / 2) + 'px';

	isFgColorSelectorVisible = true;
}

function onMenuBackgroundColor()
{
	cleanPopUps();

	backgroundColorSelector.show();
	backgroundColorSelector.container.style.left = ((SCREEN_WIDTH - backgroundColorSelector.container.offsetWidth) / 2) + 'px';
	backgroundColorSelector.container.style.top = ((SCREEN_HEIGHT - backgroundColorSelector.container.offsetHeight) / 2) + 'px';

	isBgColorSelectorVisible = true;
}

function onMenuSelectorChange(newBrush)
{
	if (BRUSHES[newBrush] == "")
		return;

	brush.destroy();
	brush = eval("new " + BRUSHES[newBrush] + "(context)");

	window.location.hash = BRUSHES[newBrush];
}

function onMenuMouseOver()
{
	isMenuMouseOver = true;
}

function onMenuMouseOut()
{
	isMenuMouseOver = false;
}

function onMenuSave()
{
	// window.open(canvas.toDataURL('image/png'),'mywindow');
	flatten();
	window.open(flattenCanvas.toDataURL('image/png'),'mywindow');
}

function onMenuClear()
{
	if (!confirm("Are you sure?"))
		return;

	context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	saveToLocalStorage();

	brush.destroy();
	brush = eval("new " + BRUSHES[menu.selector.selectedIndex] + "(context)");
}

function onMenuAbout()
{
	cleanPopUps();

	isAboutVisible = true;
	about.show();
}


// CANVAS

function onCanvasMouseDown( event )
{
	var data, position;
	clearTimeout(saveTimeOut);
	cleanPopUps();

	if (altKeyIsDown)
	{
		flatten();

		data = flattenCanvas.getContext("2d").getImageData(0, 0, flattenCanvas.width, flattenCanvas.height).data;
		position = (event.clientX + (event.clientY * canvas.width)) * 4;

		foregroundColorSelector.setColor( [ data[position], data[position + 1], data[position + 2] ] );

		return;
	}

	BRUSH_PRESSURE = wacom && wacom.isWacom ? wacom.pressure : 1;

	brush.strokeStart( event.clientX, event.clientY );

	window.addEventListener('mousemove', onCanvasMouseMove, false);
	window.addEventListener('mouseup', onCanvasMouseUp, false);
}

function onCanvasMouseMove( event )
{
	BRUSH_PRESSURE = wacom && wacom.isWacom ? wacom.pressure : 1;

	brush.stroke( event.clientX, event.clientY );
}

function onCanvasMouseUp()
{
	brush.strokeEnd();

	window.removeEventListener('mousemove', onCanvasMouseMove, false);
	window.removeEventListener('mouseup', onCanvasMouseUp, false);

	if (STORAGE)
	{
		clearTimeout(saveTimeOut);
		saveTimeOut = setTimeout(saveToLocalStorage, 2000, true);
	}
}


//

function onCanvasTouchStart( event )
{
	cleanPopUps();		

	if(event.touches.length == 1)
	{
		event.preventDefault();

		brush.strokeStart( event.touches[0].pageX, event.touches[0].pageY );

		window.addEventListener('touchmove', onCanvasTouchMove, false);
		window.addEventListener('touchend', onCanvasTouchEnd, false);
	}
}

function onCanvasTouchMove( event )
{
	if(event.touches.length == 1)
	{
		event.preventDefault();
		brush.stroke( event.touches[0].pageX, event.touches[0].pageY );
	}
}

function onCanvasTouchEnd( event )
{
	if(event.touches.length == 0)
	{
		event.preventDefault();

		brush.strokeEnd();

		window.removeEventListener('touchmove', onCanvasTouchMove, false);
		window.removeEventListener('touchend', onCanvasTouchEnd, false);
	}
}

//

function saveToLocalStorage()
{
	localStorage.canvas = canvas.toDataURL('image/png');
}

function flatten()
{
	var context = flattenCanvas.getContext("2d");

	context.fillStyle = 'rgb(' + BACKGROUND_COLOR[0] + ', ' + BACKGROUND_COLOR[1] + ', ' + BACKGROUND_COLOR[2] + ')';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(canvas, 0, 0);
}

function cleanPopUps()
{
	if (isFgColorSelectorVisible)
	{
		foregroundColorSelector.hide();
		isFgColorSelectorVisible = false;
	}

	if (isBgColorSelectorVisible)
	{
		backgroundColorSelector.hide();
		isBgColorSelectorVisible = false;
	}

	if (isAboutVisible)
	{
		about.hide();
		isAboutVisible = false;
	}
}

    $(document).ready(function(){
        // Get the Flickr feed
        //$.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?id=37707146@N08&lang=en-us&format=json&jsoncallback=jsonFlickrFeed&callback=?',function(){},'jsonp');



        $('#changeCanvas').click(function(){
            $('#canvasDrop').slideDown();
        });

        $('#canvasDrop').live('mouseleave',function(){
            $('#canvasDrop').slideUp();
            $('#canvasDrop ul li').css('border','none');
            $('#canvasDrop ul li').css('height','30px');
        });

        $('#canvasDrop ul li').live('mousedown mouseup',function(event){
            if(event.type == 'mousedown'){
                $(this).css('border-top','2px inset black');
                $(this).css('border-bottom','3px inset black');
                $(this).css('height','25px');
            }else{
                $(this).css('border-top','1px inset black');
                $(this).css('border-bottom','2px inset black');
                $(this).css('height','27px');
            }

        });

        // Clear the canvas
        $('#resetCanvas').click(function(){
            var canvas = document.getElementById('backgroundCanvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        });

        $('#toggleContent').click(function(){
            if($('#content').css('display') != 'none'){
                $('#content').fadeOut();
            }else{
                $('#content').fadeIn();
            }
        });

        $('#changeBrush').click(function(){
            if($('#brushes').length == 0){
                var brushSelectHTML =   '<ul id="brushes" style="list-style:none">';
                brushSelectHTML     +=  '<li class="brush" id="0">Ribbon</li>';
                brushSelectHTML     +=  '<li class="brush" id="1">Chrome</li>';
                brushSelectHTML     +=  '<li class="brush" id="2">Fur</li>';
                brushSelectHTML     +=  '<li class="brush" id="3">Grid</li>';
                brushSelectHTML     +=  '<li class="brush" id="4">Long Fur</li>';
                brushSelectHTML     +=  '<li class="brush" id="5">Shaded</li>';
                brushSelectHTML     +=  '<li class="brush" id="6">Simple</li>';
                brushSelectHTML     +=  '<li class="brush" id="7">Sketchy</li>';
                brushSelectHTML     +=  '<li class="brush" id="8">Web</li>';
                brushSelectHTML     +=  '</ul>';
                $(this).after(brushSelectHTML);
            }else{
                $('#brushes').remove();
            }
        });

        $('.brush').live('click',function(){
            onMenuSelectorChange($(this).attr('id'));
            $('#brushes').fadeOut(function(){
                $(this).remove();
            });
        });

        $('#playPause').click(function(){
            var myAudio = document.getElementsByTagName('audio')[0];
            if(!myAudio.paused){
                myAudio.pause();
            }else{
                myAudio.play();
            }
        });
    });


})(this,this.document);