window.onload = function(){
	var canvas = document.getElementById("canvas");
	var canvasContext = canvas.getContext("2d");
	canvas.width = 600;
	canvas.height = 600;
	
	canvas.addEventListener( "mousedown", clickEventsHandler, false );
	document.addEventListener("mousemove", mouseMoveHandler, false);
	
	var mouseIn = true;
	var mouseX = 0;
	var mouseY = 0;
	
	var linkedList = getLinkedList();
	
	
	draw();
	
	
	
	
	
	
	function draw(){
		window.requestAnimationFrame(draw);
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		
		if(linkedList.size > 0)
		{
			canvasContext.beginPath();
			canvasContext.moveTo(linkedList.first.info.y, linkedList.first.info.x);
			
			var it = linkedList.first.next;
			while( it != linkedList.first ){
				canvasContext.lineTo(it.info.y, it.info.x);
				it = it.next;
			}
			
			if( mouseIn == true ){
				canvasContext.lineTo(mouseX, mouseY);
			}

			canvasContext.stroke();
		}
		
		
	};
	
	
	function clickEventsHandler(e){
		var point = getPoint(e.clientY, e.clientX);
		linkedList.add( point );
	};
	
	function mouseMoveHandler(e){
		if( e.clientX <= canvas.width && e.clientX > 0 && e.clientY <= canvas.height && e.clientY > 0 ){
			mouseIn = true;
			mouseX = e.clientX;
			mouseY = e.clientY;
		}
		else{
			mouseIn = false;
		}
	};
	
	
};










function getLinkedList(){
	var that = {};
	
	that.first = null;
	that.last = null;
	that.size = 0;
	that.add = function( info ){
		++that.size;
		if( that.first == null ){
			that.first = that.last = getNode(info);
			that.first.next = that.first.prev = that.first;
			return;
		}
		else if(that.first == that.last){
			that.last = getNode(info);
			that.last.prev = that.first;
			that.last.next = that.first;
			that.first.next = that.last;
			that.first.prev = that.last;
		}
		else{
			var newNode = getNode(info);
			newNode.prev = that.last;
			that.last.next = newNode;
			that.last = newNode;
			that.last.next = that.first;
			that.first.prev = that.last;
		}
	};
	that.remove = function( node ){
		if(that.first == null)
			return;
		if(node == that.first && node == that.last){
			that.first = that.last = null;
		}
		else if(node == that.first){
			that.first = that.first.next;
			that.first.prev = that.last;
			that.last.next = that.first;
		}
		else if(node == that.last){
			that.last = that.last.prev;
			that.last.next = that.first;
			that.first.prev = that.last;
		}
		else{
			node.prev.next = node.next;
			node.next.prev = node.prev;
		}
		delete node;
		--that.size;
	};
	
	return that;
};

function getNode( info ){
	var that = {};
	
	that.prev = null;
	that.info = info;
	that.next = null;
	
	return that;
};

function getPoint(x, y){
	var that = {};
	
	that.x = x;
	that.y = y;
	
	return that;
}
