window.onload = function(){
	
	
};










function getLinkedList(){
	var that = {};
	
	that.first = null;
	that.last = null;
	that.add = function( info ){
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
	};
	
	return that;
};

function getNode( info ){
	var that = {};
	
	that.prev = null;
	that.info = info;
	that.next = null;
	
	return that;
	
}
