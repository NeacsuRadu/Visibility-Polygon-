window.onload = function(){
	var canvas = document.getElementById("canvas");
	var canvasContext = canvas.getContext("2d");
	canvas.width = 600;
	canvas.height = 600;
	
	canvas.addEventListener( "mousedown", clickEventsHandler, false );
	document.addEventListener("mousemove", mouseMoveHandler, false);
	
	var polygonSet = false;
	var mouseIn = true;
	var mouseX = 0;
	var mouseY = 0;
	var itt;
	var iter = 0;
	var vec = new Array();
	var linkedList = getLinkedList();
	
	draw();
	
	
	function draw(){
		
		if( polygonSet == false )
		{
			window.requestAnimationFrame(draw);
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
			if(linkedList.size > 0){
				canvasContext.beginPath();
				canvasContext.moveTo(linkedList.first.info.y, linkedList.first.info.x);
				
				var it = linkedList.first.next;
				while( it != linkedList.first ){
					canvasContext.lineTo(it.info.y, it.info.x);
					it = it.next;
				}
				
				if( mouseIn == true && polygonSet == false ){
					canvasContext.lineTo(mouseX, mouseY);
				}

				if( polygonSet == true )
					canvasContext.closePath();
				canvasContext.stroke();
				if( polygonSet == false )
				{
					canvasContext.closePath();
				}
			}
		}
		else
		{
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
			drawPolygonByTriangles();
		}
	};
	
	function drawPolygonByTriangles(){
		canvasContext.beginPath();
		canvasContext.moveTo(vec[iter].e1.a.y, vec[iter].e1.a.x);  
		canvasContext.lineTo(vec[iter].e1.b.y, vec[iter].e1.b.x);
		canvasContext.lineTo(vec[iter].e2.b.y, vec[iter].e2.b.x);
		canvasContext.closePath();
		canvasContext.stroke();
		
		++iter;
		
		if( iter <= vec.length - 1 ){
			setTimeout( drawPolygonByTriangles, 100 );
		}
	};
	
	function clickEventsHandler(e){
		var point = getPoint(e.clientY, e.clientX);
		if(linkedList.size > 0 && (point.x - linkedList.first.info.x <= 3 || point.x - linkedList.first.info.x <= -3) && (point.y - linkedList.first.info.y <= 3 || point.y - linkedList.first.info.y <= -3)){
			polygonSet = true;
			computeTriangulation();
		}
		else{
			linkedList.add( point );
		}
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
	
	function determinant(a, b, c ){
		return (a.x * b.y ) + (b.x * c.y ) + (c.x * a.y ) - (c.x * b.y) - (c.y * a.x) - (b.x * a.y);
	};

	function curba(a, b, c){
		var det = determinant(a, b, c);
		if( det < 0 )
			return -1;
		if( det > 0 )
			return 1;
		return 0;
	};

	function checkClockwise(){
		var sum = 0;
		var it = linkedList.first;
		for( var i = 0; i < linkedList.size; ++ i ){
			sum += curba(it.info, it.next.info, it.next.next.info);
			it = it.next;
		}
		if(sum < 0)
			return true;
		return false;
	};
	
	function toClockwise(){
		var new_list = getLinkedList();
		var it = linkedList.first;
		while(1){
			new_list.add(it.info);
			if( it.prev == linkedList.first ){
				break;
			}
			it=it.prev;
		}
		linkedList = new_list;
	};

	function setEdges(){
		var it = linkedList.first;
		for( var i = 0; i < linkedList.size; ++ i )
		{
			it.info.firstEdge = it.prev.info.secondEdge;
			it.info.secondEdge = getEdge( it.info, it.next.info );
			it = it.next;
		}
		linkedList.first.info.firstEdge = linkedList.last.info.secondEdge;
	};

	function inTriunghi(a, b, c, pct){
		var nr = 0;
		nr += curba(a, b, pct);
		nr += curba(b, c, pct);
		nr += curba(c, a, pct);
		if( nr == 3 || nr == -3 || nr == 2 || nr == -2 )
			return true;
		return false;
	};
	
	function verificare(a, b, c){
		if(determinant(a.info, b.info, c.info) > 0)
			return false;
		for( var it = c.next; it != a; it = it.next ){
			if( inTriunghi(a.info, b.info, c.info, it.info) == true )
				return false;
		}
		return true;
	};
	
	function getTriangles(){
		var nr = 0;
		var it = linkedList.first;
		var number_of_vertices = linkedList.size;
		
		while( nr < number_of_vertices - 3)
		{
			if(verificare(it.prev, it, it.next) == true)
			{
				var p1 = getPoint( it.prev.info.x, it.prev.info.y );
				var p2 = getPoint( it.next.info.x, it.next.info.y );
				
				it.info.firstEdge.a = p1;
				it.info.secondEdge.b = p2;
				p1.secondEdge = it.info.firstEdge;
				p2.firstEdge = it.info.secondEdge;
				
				p2.secondEdge = getEdge( p2, p1 );
				p1.firstEdge = p2.secondEdge;
				
				it.prev.info.secondEdge = getEdge( it.prev.info, it.next.info );
				it.next.info.firstEdge = it.prev.info.secondEdge;
				
				it.prev.info.secondEdge.dual = p2.secondEdge;
				p2.secondEdge.dual = it.prev.info.secondEdge;
				
				var t = getTri( it.info.firstEdge, it.info.secondEdge, p2.secondEdge );
				
				it.info.firstEdge.t = t;
				it.info.secondEdge.t = t;
				p2.secondEdge.t = t;
				
				vec.push(t);
				
				var del = it;
				it = it.next;
				linkedList.remove(del);
				++nr;
			}
			else
			{
				it = it.next;
			}
		}
		var t = getTri( linkedList.first.info.firstEdge, linkedList.first.info.secondEdge, linkedList.first.next.info.secondEdge);
		linkedList.first.info.firstEdge.t = t;
		linkedList.first.info.secondEdge.t = t;
		linkedList.first.next.info.secondEdge.t =t ;
		vec.push(t);
	};
	
	function computeTriangulation(){
		var clockwise = checkClockwise();
		if( clockwise == false )
		{
			toClockwise();
		}
		setEdges();
		getTriangles();
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
	that.firstEdge = null;
	that.secondEdge = null;
	return that;
};

function getEdge(a, b){
	var that = {};
	
	that.a = a;
	that.b = b;
	that.t = null;
	that.dual = null;
	that.inner = false;
	
	return that;
}

function getTri(e1, e2, e3){
	var that = {};
	
	that.e1 = e1;
	that.e2 = e2;
	that.e3 = e3;
	
	return that;
}

