
$(document.body).ready(function(e) {
	$.Placeholder.init();

	//var oldtext = "", oldcolor="";
	//$(":text, textarea").focus(function(){ oldtext=$(this).val(); oldcolor=$(this).css("color"); $(this).val(""); }).blur(function(){ if($(this).val()=="") $(this).css("color", oldcolor).val(oldtext); });
	$("ul").each(function(){ $(this).children("li:first").addClass("first"); });
	$(".guide-one:first").addClass("guide-item-active");
	$(".tabs > ul, .tabs2 > ul").idTabs();
	
	$(":checkbox").addClass("checkbox");
	
	/*$(".iframe").fancybox({
		width: 800,
		height: 400,
		autoSize: false,
		type: 'iframe'
	});*/
	
	$(".video_a").append("<span></span>").fancybox({
		padding: 0,
		autoScale: false,
		transitionIn: 'none',
		transitionOut: 'none'
	});
	
	var navh = $(".nav").height();
	var nfh = $(".nav .float").height();
	var newh = 100;
	$(".nav .float > ul > li").mouseenter(function(){
		var floatobj = $(this);
		$(".nav").stop().animate({ height: navh }, 200);
		$(".nav .float").stop().animate({ height: nfh }, 200);
		$(".nav .float > ul > li > ul").stop().animate({ height: 0 }, 200, function(){
		
			if(floatobj.children("ul").size()>0)
			{
				//if($(this).hasClass("active")){
				//	$(this).removeClass("active");
				//} else {
					$(".nav li.active").removeClass("active");
					$(".nav").stop().animate({ height: navh + newh });
					$(".nav .float").stop().animate({ height: nfh + newh });
					floatobj.addClass("active").children("ul").stop().animate({ height: newh }, 100);
				//}
			}
		
		});
		return false;
	}).mouseleave(function(){
		$(".nav li.active").removeClass("active");
		$(".nav").stop().animate({ height: navh }, 200);
		$(".nav .float").stop().animate({ height: nfh }, 200);
		$(".nav .float > ul > li > ul").stop().animate({ height: 0 }, 200);
	});

	//$(".nav .banner, .nav .banner ul, .nav .banner li").css("height", $(window).height());
	
	var bint = null;
	var bi = 0;
	var bs = $(".banner li").size();
	$(".banner > ul").append($(".banner > ul").html());
	$(".banner li").css("width", $(".banner").width());
	$(".banner").children("div").css("opacity", 0.6).mouseenter(function(){
		$(this).stop().animate({"opacity": 1}, 200);
	}).mouseleave(function(){
		$(this).stop().animate({"opacity": 0.6}, 200);
	}).click(function(){
		clearInterval(bint);
		if($(this).hasClass("prev"))
			bi--;
		else
			bi++;
		if(bi<0){
			bi = bs;
			$(".banner > ul").css("left", bi * $(".banner").width() * -1);
			bi--;
		}
		$(".banner > ul").stop().animate({ left: bi * $(".banner").width() * -1 }, function(){
			if(bi>=bs)
			{
				bi=0;
				$(".banner > ul").css("left", 0);
			}
			
			bint = setInterval(function(){ $(".banner div.next").click(); }, 10000);
		});
	});
	
	bint = setInterval(function(){ $(".banner div.next").click(); }, 10000);
	
	
	$(".guide-one .body").each(function(){ $(this).attr("rel", $(this).height()); if(!$(this).parent().hasClass("guide-item-active")) $(this).css({ height:0 }); });
	$(".guide-one .title").click(function(){
		if(!$(this).parent().hasClass("guide-item-active")){
			var _b = $(this).parent().children(".body");
			//alert(_b.html());
			
			_b.animate({ height: parseInt(_b.attr("rel")) }, 500, function(){
				$(this).parent().addClass("guide-item-active");
			});
			
			$(".guide-item-active").children(".body").animate({ height: 0 }, 500, function(){
				$(this).parent().removeClass("guide-item-active");
			});
		}
	});
	
	var ti=0;
	$(".teaching").css({ height: $(".teaching-item:first").height() });
	$(".teaching-body").append($(".teaching-body").html());
	$(".teaching-btn").children("a").css("opacity", 0.6).mouseenter(function(){
		$(this).stop().animate({"opacity": 1}, 200);
	}).mouseleave(function(){
		$(this).stop().animate({"opacity": 0.6}, 200);
	}).click(function(){
		if($(this).hasClass("prev"))
			ti--;
		else
			ti++;
		if(ti<0){
			ti = bs;
			$(".teaching-body").css("left", ti * $(".teaching").width() * -1);
			ti--;
		}
		$(".teaching-body").stop().animate({ left: ti * $(".teaching").width() * -1 }, function(){
			if(ti>=bs)
			{
				ti=0;
				$(".teaching-body").css("left", 0);
			}
		});
		return false;
	});
});