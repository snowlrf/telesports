/*
 * jQuery Miloc Plugin v0.0.1
 * http://www.miloce.com/
 *
 * Copyright (c) 2010 miloc
 */

//图片简单切换
//slider
//slider({speed: 3000, animate: 1000});
$.fn.slider = function(o){
	var defaults = {
		speed : 5000,
		animate : 500,
		button : false
	};
	o = $.extend(defaults, o);
	
	return this.each(function(){
		if(o.button==true){
			$(this).prepend('<div class="effect_guide effect_guide_left"><a href="">PREV</a></div><div class="effect_guide effect_guide_right"><a href="">NEXT</a></div>');
			var _et = ($(this).height() - $(".effect_guide").height()) / 2;
			$(".effect_guide").css({position: "absolute", top:_et, "z-index": 999});
			$(this).hover(function(){$(".effect_guide").show()},function(){$(".effect_guide").hide()})
		}
		var arr_e = $("li", this);
		arr_e.css({position: "absolute"});
		arr_e.parent().css({margin: "0", padding: "0", "list-style": "none", overflow: "hidden"});
		arr_e.first().css({"z-index": 9});
		
		function prev(){
			var active = arr_e.filter(".active").length ? arr_e.filter(".active") : arr_e.first();
			var prev =  active.prev().length ? active.prev() : arr_e.last();
	
			active.css({"z-index": 9});
			prev.css({opacity: 0.0, "z-index": 10})
				.addClass('active')
				.animate({opacity: 1.0}, o.animate, function() {
					active.removeClass('active').css({"z-index": 8});
				});
		}
		
		function next(){
			var active = arr_e.filter(".active").length ? arr_e.filter(".active") : arr_e.first();
			var next =  active.next().length ? active.next() : arr_e.first();
	
			active.css({"z-index": 9});
			next.css({opacity: 0.0, "z-index": 10})
				.addClass('active')
				.animate({opacity: 1.0}, o.animate, function() {
					active.removeClass('active').css({"z-index": 8});
				});
		}
		
		var t = setInterval(function(){ next(); }, o.speed);
		
		//按钮链接
		$(".effect_guide_left", this).click(function(){clearInterval(t);prev();t = setInterval(function(){ next(); }, o.speed);return false;});
		$(".effect_guide_right", this).click(function(){clearInterval(t);next();t = setInterval(function(){ next(); }, o.speed);return false;});
	});
};

//图片滚动
//imgscroll({speed: 30,amount: 1,dir: "up"});
$.fn.imgscroll = function(o){
	var defaults = {
		speed: 5000,
		amount: 500,
		width: 1,
		dir: "left"
	};
	o = $.extend(defaults, o);
	
	return this.each(function(){
		var _li = $("li", this);
		_li.parent().parent().css({overflow: "hidden", position: "relative"}); //div
		_li.parent().css({margin: "0", padding: "0", overflow: "hidden", position: "relative", "list-style": "none"}); //ul
		_li.css({position: "relative", overflow: "hidden"}); //li
		if(o.dir == "left") _li.css({float: "left"});
		
		//初始大小
		var _li_size = 0;
		for(var i=0; i<_li.size(); i++)
			_li_size += o.dir == "left" ? _li.eq(i).outerWidth(true) : _li.eq(i).outerHeight(true);
		
		//循环所需要的元素
		if(o.dir == "left") _li.parent().css({width: (_li_size*3)+"px"});
		_li.parent().empty().append(_li.clone()).append(_li.clone()).append(_li.clone());
		_li = $("li", this);

		//滚动
		var _li_scroll = 0;
		function goto(){
			_li_scroll += o.width;
			if(_li_scroll > _li_size || _li_scroll==0)
			{
				_li_scroll = 0;//o.width * -1;
				_li.parent().css(o.dir == "left" ? { left : -_li_scroll } : { top : -_li_scroll });
				_li_scroll += o.width;
			}
			_li.parent().animate(o.dir == "left" ? { left : -_li_scroll } : { top : -_li_scroll }, o.amount);
		}
		
		//开始
		var move = setInterval(function(){ goto(); }, o.speed);
		_li.parent().hover(function(){
			clearInterval(move);
		},function(){
			clearInterval(move);
			move = setInterval(function(){ goto(); }, o.speed);
		});
	});
};

//图片菜单
$.fn.menuimage = function(o){
	var defaults = {
		width: ""  //各个链接宽度，背景图片x轴位置自动计算
	};
	o = $.extend(defaults, o);
	
	return this.each(function(){
		var _x = 0;
		var _w = o.width.split(",");
		var _img = $(this).find("a");
		
		//链接宽度，和背景x轴
		for(var _i=0; _i<_w.length; _i++){
			_img.eq(_i).css({
				"width": _w[_i] + "px",
				"background-position-x": _x + "px"
			});
			_x -= _w[_i];
		}
		//鼠标事件
		_img.hover(function(){
			//document.title = $(this).css("background-position-x");
			$(this).css("background-position-y", ($(this).css("background-position-y") - $(this).height()) + "px");
		}, function(){
			$(this).css("background-position-y", ($(this).css("background-position-y") + $(this).height()) + "px");
		});
	});
};

//ul菜单下拉
$.fn.ulmenu = function() {
	return this.each(function() {
		var _m = $(this);
		_m.find("ul").hide().css({"display":"none", "position":"absolute", "z-index": 99999999});
		//_m.find("ul li").css({"float":"none"});
		_m.find("a").css({"white-space":"nowrap"});
		//鼠标离开时隐藏
		_m.mouseleave(function(){
			$(this).find("ul").hide();
			$(this).find("a").removeClass("hover");
			$(".menu_mask").hide();
		});
		//第一级鼠标事件
		_m.children("li").hover(function() {
			$(".menu_mask").show();
			$(this).parent().find("a").removeClass("hover");
			$("a", this).addClass("hover");
			$(this).parent().find("ul").hide();
			if ($(this).children("ul").length>0) {
				var _ml = $(this).offset().left;
				var _mt = $(this).offset().top + $(this).children("a:first").height();
				var _mw = $(this).width();
				var _dl = _m.offset().left;
				var _dw = _m.width();
				var _uw = $(this).children("ul").width();
				$(this).children("ul").css({"width": _uw, "left": _ml, "top": _mt}).show();
			}
		}, function() {
			//$(this).find("ul").hide();
		});
		//第二级之后包含第二级
		_m.find("ul li").hover(function() {
			$(this).parent().find("ul").hide();
			$(this).find("a").removeClass("hover");
			if ($(this).children("ul").length>0) {
				var _ml = $(this).width();
				var _mt = $(this).parent().height() - $(this).height();
				var _uw = $(this).children("ul").width();
				
				$(this).children("ul").css({"width": _uw + "px", "left": _ml + "px", "top": _mt + "px"}).show();
			}
		}, function() {
			//$(this).find("ul").hide();
		});
	});
}

	

	
	$.fn.mc_focus = function(settings){
		settings = jQuery.extend({
			interval : 3000,
			speedtime : 300,
			width : 0,
			height : 0,
			showbtn : false,
			showtitle : false
		}, settings);
		
		var mc_this = this;
		var mc_selector = $(mc_this).selector;
		var mc_item = $(mc_selector + ' li');
		
		//默认加载
		function initialize(){
			mc_this.css('position', 'relative');
			$(mc_selector).addClass('focus');
			$(mc_selector + ' ul').wrap('<div class="focus_body" />');
			//标题框
			if(settings.showtitle){
				mc_this.append('<div class="focus_title" /><div class="focus_title_mask" />');
				//标题样式
				$(mc_selector + ' .focus_title_mask').css({opacity: 0.5});
			}
			//默认样式
			if(settings.width>0) $(mc_selector).css({width: settings.width});
			if(settings.height>0) $(mc_selector).css({height: settings.height});
			
			loadbindbtn();
			loaddefault();
			loadeffect();
		}
		
		//加载默认内容
		function loaddefault(){
			//标题
			$(mc_selector + ' .focus_title, ' + mc_selector + ' .focus_title_mask').html(mc_item.first().children('a').attr('title'));
		}
		
		//加载按钮
		function loadbindbtn(){
			if(settings.showbtn && mc_item.length>0){
				//导航按钮
				var mc_btnlist = '';
				for(var i=1; i<=mc_item.length; i++) mc_btnlist += '<li>' + i + '</li>';
				mc_this.append('<div class="focus_nav"><ul>' + mc_btnlist + '</ul></div>');
				//按钮绑定事件
				$(mc_selector + ' .focus_nav li').bind('mouseover', function(){
					btneffect();
					runindex(parseInt($(this).text())-1);
				});
				$(mc_selector + ' .focus_nav').css({ position: 'absolute', 'z-index': 10, right:10, bottom:10 });
				//默认第1个按钮
				$(mc_selector + ' .focus_nav li').css({ display: 'inline', padding: '5px 10px', margin: '0 0 0 5px', background: '#fff', cursor: 'pointer' }).first().addClass('selected');
			}
		}
		
		// ===================================================================================
		// 效果
		// ===================================================================================
		
		var intervaleffect;
		
		//加载效果
		function loadeffect(){
			mc_item.first().addClass('active').css({'z-index': 2});
			mc_item.css({position: 'absolute', top: 0, left: 0});
			
			intervaleffect = setInterval(function(){ runeffect(); }, settings.interval);
		}
		
		//定时效果
		function runeffect(){
			var active = mc_item.filter('.active').length ? mc_item.filter('.active') : mc_item.first();
			var next =  active.next().length ? active.next() : mc_item.first();
			
			goeffect(active, next);
		}
		
		//指定效果
		function runindex(index){
			var active = mc_item.filter('.active').length ? mc_item.filter('.active') : mc_item.first();
			var next =  mc_item.size() >= index ? mc_item.eq(index) : mc_item.first();
			
			goeffect(active, next);
			//恢复定时器
			intervaleffect = setInterval(function(){ runeffect(); }, settings.interval);
		}
		
		//导航按钮事件
		function btneffect(){
			clearInterval(intervaleffect);
		}
		
		//运行效果
		function goeffect(active, next){
			active.css({'z-index': 1});
			next.css({opacity: 0.0, 'z-index': 2})
			.addClass('active')
			.animate({opacity: 1.0}, settings.speedtime, function() {
				active.removeClass('active').css({'z-index': 0});
			});
			
			$(mc_selector + ' .focus_nav li').removeClass('selected');
			$(mc_selector + ' .focus_nav li').eq(next.index()).addClass('selected');
			$(mc_selector + ' .focus_title, ' + mc_selector + ' .focus_title_mask').html(next.children('a').attr('title'));
		}
		
		initialize();
	};