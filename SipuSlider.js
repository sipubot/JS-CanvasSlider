var SIPUSlider = (function (SIPUSlider, $, undefined) {
	"use strict";
	//master function
	var DATANODE = getDataNode();
	var SLIDERNAME = getSliderName();

	var Slider = {
		SetAttrVal: "",
		SetFadeTime: 0.5,
		SetRangeMax: 255,
		SetCanvasHeight: 600,
		SetCanvasWidth: 800,
		SetImages: "",
		CanvasNode: "",
		ImageListNode: "",
		PlayButtonNode: "",
		StopButtonNode: "",
		RangeNode: "",
		Valid: 0,
		OnPlaying: false,
		SetNode: function () {
			if (this.SetAttrVal.length > 0) {
				for (var i = 0; i < DATANODE.length; i++) {
					if (DATANODE[i].getAttribute("data-sipu-canvas") === this.SetAttrVal) {
						this.CanvasNode = DATANODE[i];
						this.Valid++;
					}
					if (DATANODE[i].getAttribute("data-sipu-images") === this.SetAttrVal) {
						this.ImageListNode = DATANODE[i];
						this.Valid++;
					}
					if (DATANODE[i].getAttribute("data-sipu-playbutton") === this.SetAttrVal) {
						this.PlayButtonNode = DATANODE[i];
						this.Valid++;
					}
					if (DATANODE[i].getAttribute("data-sipu-stopbutton") === this.SetAttrVal) {
						this.StopButtonNode = DATANODE[i];
						this.Valid++;
					}
					if (DATANODE[i].getAttribute("data-sipu-range") === this.SetAttrVal) {
						this.RangeNode = DATANODE[i];
						this.Valid++;
					}
				}
			}
		},
		ValidCheck: function () {
			if (this.Valid === 5) {
				return true;
			}
		},
		init: function () {
			this.SetNode();
			if (this.ValidCheck()) {
				this.ImageListNode.style.display = "none";

				if (this.SetImages.length < 1) {
					this.SetImages = setImageList(this.ImageListNode);
				}
					var setV = setCanvas(this.CanvasNode);
					this.SetCanvasHeight = setV[0];
					this.SetCanvasWidth = setV[1];
					setAnimate(this.CanvasNode, this.SetFadeTime);
					setRangeNode(this.RangeNode, 1, this.SetRangeMax, this.SetImages, this.CanvasNode, this.SetCanvasHeight, this.SetCanvasWidth);
			} else {
				console.log("Failed Build " + this.SetAttrVal);
			}

		}

	};

	function getDataNode() {
		var temp = [];
		var node = document.getElementsByTagName("*");
		for (var i = 0; i < node.length; i++) {
			if (node[i].attributes.length > 0) {
				var attr = (node[i].attributes);
				for (var j = 0; j < attr.length; j++) {
					var at = attr[j].name.split("-");
					if (at[0] === "data" && at[1] === "sipu") {
						temp.push(node[i]);
					}
				}
			}
		}
		return temp;
	}

	function getSliderName() {
		var temp = [];
		var node = DATANODE;
		for (var i = 0; i < node.length; i++) {
			if (node[i].attributes.length > 0) {
				var attr = (node[i].attributes);
				for (var j = 0; j < attr.length; j++) {
					var at = attr[j].name.split("-");
					if (at[0] === "data" && at[1] === "sipu") {
						var valueName = attr[j].nodeValue;
						if (temp.indexOf(valueName) === -1) {
							temp.push(valueName);
						}
					}
				}
			}
		}
		return temp;
	}

	function initSlider() {
		var sliders = [];
		for (var i = 0; i < SLIDERNAME.length; i++) {
			sliders.push(Slider);
			sliders[i].SetAttrVal = SLIDERNAME[i];
			sliders[i].init();
		}
	}

	function setCanvas(node) {
		var getHeight = node.width || 640;
		var getWidth = node.height || 480;
		return [getHeight, getWidth];
	}

	function setImageList (node) {
		var img = $(node).find("img");
		var loadcheck = 0;
		var loadimage = new Array(img.length);
		$.each(img, function (index){
			var newImg = new Image();
			newImg.onload = function () {
				loadimage[index] = newImg;
				loadcheck++;
			};
			newImg.src = img[index].src;
		});
		return loadimage;
	}

	function setRangeNode(node, min, max, images, canvas, h, w) {
		node.value = 1;
		node.setAttribute("min", min);
		node.setAttribute("max", max);
		$(node).on("change mousemove input", function () {
			drawCanvasNode(canvas, min, max, this.value, images, h, w);
		});

	}

	function drawCanvasNode (node, min, max, value, images, h, w) {
		var context = node.getContext("2d");
		context.canvas.height = h;
		context.canvas.width = w;
		context.imageSmoothingEnabled = !1;
		context.mozImageSmoothingEnabled = !1;
		var index = Math.ceil(value /	(max / (images.length - 1)));
		var alphavalue = Math.ceil(value / (max / (images.length - 1))) - value / (max / (images.length - 1));
		context.drawImage(images[index - 1], 0, 0, images[index - 1].width, images[index - 1].height, 0, 0, w, h);
		context.globalAlpha = 1 - alphavalue;
		context.drawImage(images[index], 0, 0, images[index].width, images[index].height, 0, 0, w, h);
		context.globalAlpha = alphavalue;
		console.log(images[index - 1].width);
	}


	function setPlayButtonNode (node, rangeNode) {

	}

	function setStopButtonNode (node, rangeNode) {

	}




	function setAnimate(node, time) {
		$(node).css("-webkit-transition", "all " + time + "s ease-in-out");
		$(node).css("-moz-transition", "all " + time + "s ease-in-out");
		$(node).css("-o-transition", "all " + time + "s ease-in-out");
		$(node).css("transition", "all " + time + "s ease-in-out");
	}

	SIPUSlider.run = function () {
		initSlider();
	};
	return SIPUSlider;
})(window.SIPUSlider || {}, jQuery);
SIPUSlider.run();
