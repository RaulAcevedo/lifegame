
var cell = function(){
	var xIndex =0,yIndex=0,alive=0;

	return {
		create:function(cx,cy){
				xIndex = cx; yIndex =cy;
				alive =  Math.round(Math.random());
				return this;
			},
		getX:function(){return xIndex;},
		getY:function(){return yIndex;},
        getAlive:function(){return alive},
        setAlive:function(pAlive){alive = pAlive;}
	};
}

var grid = function(){
	var height=0,width=0,size =0,elements=[],nextStates=[];

	function makeCell(allow){
		if(allow == false) return
		var index = elements.length;
		elements.push(cell().create((index%width),Math.floor(index/width)));
		makeCell(elements.length < size);
	}

	function getCellAt(cx,cy){
		var arrayIndex = (cy*width)+cx;
		return elements[arrayIndex];
	}

	function cellState(cx,cy){
		return ((cx >= 0)&&(cx < width)&&(cy >= 0)&&(cy < height))?getCellAt(cx,cy).getAlive():0;
	}

	function getNeightborsState(cx,cy){
		return 	cellState(cx-1,cy-1)+
				cellState(cx-1,cy)	+
				cellState(cx-1,cy+1)+
				cellState(cx,cy-1)+
				cellState(cx,cy+1)+
				cellState(cx+1,cy-1)+
				cellState(cx+1,cy)+
				cellState(cx+1,cy+1);
	}

	function generateCellNextState(index){
		if(index >= elements.length) {goToCellNextState(0);return;}
		var nextState = elements[index].getAlive(), 
			neighborState = getNeightborsState(elements[index].getX(),elements[index].getY());
		nextState = (nextState == 0 && neighborState == 3)?1:
					(nextState == 1 && (neighborState == 3||neighborState == 2))?1:0;
		nextStates.push(nextState);
		return generateCellNextState(index+1);
	}

	function goToCellNextState(index){
		if(index >= elements.length)return;
		elements[index].setAlive(nextStates[index]);
		return goToCellNextState(index+1);
	}

	return{
		create:function(pWidth,pHeight){
				width = pWidth;
				height = pHeight;
				size = pWidth*pHeight;
				makeCell(elements.length < size);
				return this;
			},
		render:function(){
			var field =  document.getElementById("field");
			field.innerHTML = "";
			for (var i = 0; i < elements.length ; i++) {
				field.innerHTML += "<div class='block "+(elements[i].getAlive()>0?"alive":"dead")+"'></div>";
				if(i%width == (width-1))
					field.innerHTML+="<br/>";
			};
		},
		calculateNextState:function(){
				nextStates = [];
				generateCellNextState(0);
				this.render();
		}
	};
}




var targetGrid;
targetGrid = grid().create(20,10);
targetGrid.render();

function lifeGame(){
	targetGrid.calculateNextState();
}

