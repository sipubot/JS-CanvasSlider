var SIPU = (function(SIPU, $, undefined) {
	"use strict";
	//master function
	var Selector = function (){
		this.node = "";
		this.active = false;
	};

	function getSelector(val, tag) {
		var temp = [];
		var node = document.getElementsByTagName("*");
		for (var i = 0; i < node.length ; i++ ) {
			if (node[i].getAttribute("SIPU-INTERACTIVE") === val && node[i].tagName === tag) {
				var a = new Selector();
				a.node = node[i];
				temp.push(a);
			}
		}
		return temp;
	}

	function loadImage(imgsrc) {
		var images = [];
		var count = 0;
		$.each (imgsrc,function (index) {
			var imageObj = new Image();
			imageObj.onload = function () {
				images.push(imageObj);
			};
			imageObj.src = imgsrc[index];
		});
		return images;
	}

	function getimagelist(imgList) {
		var imgs = [];
		$.each(imgList,function (index){
			$(imgList[index].node).hide();
			var chimg = $(imgList[index].node).children("img");
			var chimglist = [];
			$.each(chimg,function() {
				chimglist.push($(this).attr("src"));
			});
			imgs.push(loadImage(chimglist));
		});
		return imgs;
	}

	function do_input_event (ran, can, iamgelist) {
		$.each(ran,function (index) {
			$(ran[index].node).on("change mousemove input", function () {
				$(this).attr("min","1");
				$(this).attr("max","255");
				do_canvas_event(can[index].node, iamgelist[index], $(this).val());
			});
		});
	}

	function do_canvas_event (can, img, val) {
		var ctx = can.getContext("2d");
		var sq = Math.ceil( val / (255 / (img.length - 1)));
		var sqfl = Math.ceil(val / (255 / (img.length - 1))) - (val / (255 / (img.length - 1)));

		ctx.drawImage(img[sq-1],0,0);
		ctx.globalAlpha = 1-sqfl;
		ctx.drawImage(img[sq],0,0);
		ctx.globalAlpha = sqfl;
	}

	function do_play_button(ran, can, img) {
		$.each(ran,function (index) {
			var i = $(ran[index].node).val();
			var max = $(ran[index].node).attr("max");
			var timerId = setInterval(function () {
				ran[index].node.value = i;
				do_canvas_event(can[index].node, img[index], i);
				if (i === max) { clearInterval(timerId); }
				i++;
			} ,30);
		});
	}

	SIPU.run = function () {
		var image_list = getimagelist(getSelector("timelapse","DL"));
		var input_range_list = getSelector("timelapse","INPUT");
		var canvas_list = getSelector("timelapse","CANVAS");

		do_input_event(input_range_list, canvas_list, image_list);
	};
	return SIPU;
})(window.SIPU || {}, jQuery);
SIPU.run();
