var SIPUSlider = (function (SIPUSlider, $, undefined) {
	"use strict";
	//main struct
	var DATANODE;
	var SLIDERNAME;
	var SLIDERS = [];

	var Slider = {
		Index: -1,
		SetAttrVal: "",
		SetFadeTime: 0.5,
		SetRangeMax: 255,
		SetCanvasHeight: 600,
		SetCanvasWidth: 800,
		SetPlayInterval: 50,
		SetImages: "",
		CanvasNode: "",
		ImageListNode: "",
		PlayButtonNode: "",
		StopButtonNode: "",
		RangeNode: "",
		OnPlaying: false,
		OnPlayInterval: "",
		SetNode: function () {
			setNodeSlide(this.Index);
		},
		ValidCheck: function () {
			if (typeof (this.CanvasNode) === "object" &&
				typeof (this.ImageListNode) === "object" &&
				typeof (this.PlayButtonNode) === "object" &&
				typeof (this.StopButtonNode) === "object" &&
				typeof (this.RangeNode) === "object") {
				return true;
			}
		},
		init: function () {
			this.SetNode();
			if (this.ValidCheck()) {
				this.ImageListNode.style.display = "none";
				var callbackfunc = function (index) {
					setCanvas(index);
					setAnimate(index);
					setRangeNode(index);
					setPlayButtonNode(index);
					setStopButtonNode(index);
					//first render images
					drawCanvasNode(SLIDERS[index].CanvasNode, 1, SLIDERS[index].SetRangeMax, 1, SLIDERS[index].SetImages, SLIDERS[index].SetCanvasHeight, SLIDERS[index].SetCanvasWidth);
				};
				this.SetImages = loadImages(this.Index, callbackfunc);
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
		for (var i = 0; i < SLIDERNAME.length; i++) {
			SLIDERS.push(Slider);
			SLIDERS[i].SetAttrVal = SLIDERNAME[i];
			SLIDERS[i].Index = i;
			SLIDERS[i].init();
		}
	}

	function setNodeSlide(index) {
		if (SLIDERS[index].SetAttrVal.length > 0) {
			for (var i = 0; i < DATANODE.length; i++) {
				if (DATANODE[i].getAttribute("data-sipu-canvas") === SLIDERS[index].SetAttrVal) {
					SLIDERS[index].CanvasNode = DATANODE[i];
				}
				if (DATANODE[i].getAttribute("data-sipu-images") === SLIDERS[index].SetAttrVal) {
					SLIDERS[index].ImageListNode = DATANODE[i];
				}
				if (DATANODE[i].getAttribute("data-sipu-playbutton") === SLIDERS[index].SetAttrVal) {
					SLIDERS[index].PlayButtonNode = DATANODE[i];
				}
				if (DATANODE[i].getAttribute("data-sipu-stopbutton") === SLIDERS[index].SetAttrVal) {
					SLIDERS[index].StopButtonNode = DATANODE[i];
				}
				if (DATANODE[i].getAttribute("data-sipu-range") === SLIDERS[index].SetAttrVal) {
					SLIDERS[index].RangeNode = DATANODE[i];
				}
			}
		}
	}

	function setCanvas(index) {
		//fix bug
		SLIDERS[index].CanvasNode.style.width = SLIDERS[index].SetCanvasWidth || 640;
		SLIDERS[index].CanvasNode.style.height = SLIDERS[index].SetCanvasHeight || 480;
	}

	function loadImages(index, func) {
		//console.log(index + func);
		var img = $(SLIDERS[index].ImageListNode).find("img");
		var loadcheck = 0;
		var loadimage = new Array(img.length);
		$.each(img, function (i) {
			var newImg = new Image();
			newImg.onload = function () {
				loadimage[i] = newImg;
				loadcheck++;
				if (loadcheck === img.length) {
					SLIDERS[index].SetImages = loadimage;
					return func(index);
				}
			};
			newImg.src = img[i].src;
		});
	}

	function setRangeNode(index) {
		SLIDERS[index].RangeNode.value = 1;
		SLIDERS[index].RangeNode.setAttribute("min", 1);
		SLIDERS[index].RangeNode.setAttribute("max", SLIDERS[index].SetRangeMax);
		$(SLIDERS[index].RangeNode).on("change mousemove input", function () {
			drawCanvasNode(SLIDERS[index].CanvasNode, 1, SLIDERS[index].SetRangeMax, this.value, SLIDERS[index].SetImages, SLIDERS[index].SetCanvasHeight, SLIDERS[index].SetCanvasWidth);
		});

	}

	function drawCanvasNode(node, min, max, value, images, h, w) {
		var context = node.getContext("2d");
		context.canvas.height = h;
		context.canvas.width = w;
		context.imageSmoothingEnabled = !1;
		context.mozImageSmoothingEnabled = !1;
		var index = Math.ceil(value / (max / (images.length - 1)));
		var alphavalue = Math.ceil(value / (max / (images.length - 1))) - value / (max / (images.length - 1));
		context.drawImage(images[index - 1], 0, 0, images[index - 1].width, images[index - 1].height, 0, 0, w, h);
		context.globalAlpha = 1 - alphavalue;
		context.drawImage(images[index], 0, 0, images[index].width, images[index].height, 0, 0, w, h);
		context.globalAlpha = alphavalue;
	}


	function setPlayButtonNode(index) {
		$(SLIDERS[index].PlayButtonNode).click(function () {
			if (SLIDERS[index].OnPlaying === false) {
				var rangeval = SLIDERS[index].RangeNode.value;
				SLIDERS[index].OnPlaying = true;
				SLIDERS[index].SetPlayInterval = setInterval(function () {
					SLIDERS[index].RangeNode.value = rangeval;
					rangeval++;
					drawCanvasNode(SLIDERS[index].CanvasNode, 1, SLIDERS[index].SetRangeMax, rangeval, SLIDERS[index].SetImages, SLIDERS[index].SetCanvasHeight, SLIDERS[index].SetCanvasWidth);
					if (rangeval === parseInt(SLIDERS[index].RangeNode.getAttribute("max"))) {
						rangeval = SLIDERS[index].RangeNode.value;
						clearInterval(SLIDERS[index].SetPlayInterval);
						SLIDERS[index].OnPlaying = false;
					}
				}, SLIDERS[index].OnPlayInterval || 20);
			}
		});
	}

	function setStopButtonNode(index) {
		$(SLIDERS[index].StopButtonNode).click(function () {
			SLIDERS[index].OnPlaying = false;
			clearInterval(SLIDERS[index].SetPlayInterval);
		});
	}

	function setAnimate(index) {
		$(SLIDERS[index].CanvasNode).css("-webkit-transition", "all " + SLIDERS[index].SetFadeTime + "s ease-in-out");
		$(SLIDERS[index].CanvasNode).css("-moz-transition", "all " + SLIDERS[index].SetFadeTime + "s ease-in-out");
		$(SLIDERS[index].CanvasNode).css("-o-transition", "all " + SLIDERS[index].SetFadeTime + "s ease-in-out");
		$(SLIDERS[index].CanvasNode).css("transition", "all " + SLIDERS[index].SetFadeTime + "s ease-in-out");
	}

	SIPUSlider.run = function () {
		//master function
		DATANODE = getDataNode();
		SLIDERNAME = getSliderName();
		initSlider();
	};
	return SIPUSlider;
})(window.SIPUSlider || {}, jQuery);
SIPUSlider.run();
