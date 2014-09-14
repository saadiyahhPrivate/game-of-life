					//  THE CELL

function Cell(x, y, living){
	this.x = x;
	this.y = y;
	this.living = living;
}

Cell.prototype.getX = function(){
	return this.x;
}

Cell.prototype.getY = function(){
	return this.y;
}

Cell.prototype.takeBirth = function(){
	this.living = true;
}

Cell.prototype.die = function(){
	this.living = false;
}

Cell.prototype.isAlive= function(){
	return this.living;
}
