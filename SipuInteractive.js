var SIPU = (function(SIPU, $, undefined) {
	"use strict";
	//master function
	var Selector = function (){
		this.node = "";
		this.active = false;
	};

	var getJson = function (filename) {
		this.content = {};
		$.getJSON(filename, function(data){
			content = data;
		});
		return content;
	};

	function getSelector(val) {
		var temp = [];
		var node = document.getElementsByTagName("*");
		for (var i = 0; i < node.length ; i++ ) {
			if (node[i].getAttribute("data-sipu-interactive") === val) {
				var a = new Selector();
				a.node = node[i];
				temp.push(a);
			}
		}
		return temp;
	}

	function getMenuButton(name) {


	}

	function setSlider(nodename, postWidth) {
		//너비에 맞게.
		var a = getSelector(nodename);
		var al = 0;
		$.each(a,function(index){
			var chi = $(a[index].node).children();
			al = Math.floor(postWidth / chi.length);
			$.each(chi,function(idx) {
				$(chi[idx]).css("width",al+"px");
			});
		});
	}

	function choicSlider(nodename, postWidth, setWidth, indexChapter, indexNode) {
		//너비에 맞게.
		var a = getSelector(nodename);
		var al = 0;
		var chi = $(a[indexChapter].node).children();
		al = Math.floor((postWidth - setWidth) / (chi.length - 1));
		$.each(chi,function(idx) {
			if (idx === indexNode) {
				$(chi[idx]).css("width",setWidth+"px");
			} else {
				$(chi[idx]).css("width",al+"px");
			}
		});
	}

	function clickSlider(nodename, postWidth, setWidth) {
		var a = getSelector(nodename);
		$.each(a,function(index){
			var chi = $(a[index].node).children();
			$.each(chi,function(idx) {
				$(chi[idx]).click(function () {
<<<<<<< HEAD
					choicSlider();
=======
>>>>>>> origin/master
					choicSlider("article", postWidth, setWidth, index, idx);
				});
			});
		});
	}


	function setAnimate(node, time) {
		$(node).css("-webkit-transition","all "+time+"s ease-in-out");
		$(node).css("-moz-transition","all "+time+"s ease-in-out");
		$(node).css("-o-transition","all "+time+"s ease-in-out");
		$(node).css("transition","all "+time+"s ease-in-out");
	}

	function setAnimateNode() {
		var nodes = getSelector("slide");
		$.each(nodes, function (index){
			setAnimate(nodes[index].node,"0.5");
		});
	}

	SIPU.run = function () {
		clickSlider("article");
		setSlider("article", 1200);
		choicSlider("article", 1200, 640, 2, 1);
	};
	return SIPU;
})(window.SIPU || {}, jQuery);
SIPU.run();
