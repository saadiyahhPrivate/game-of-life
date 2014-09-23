				
					//  THE GRID

function Grid(x_dimension, y_dimension, life_chance){
	this.x_dimension = x_dimension;
	this.y_dimension = y_dimension;
	this.life_chance = life_chance;
	this.cells = []
}

// A function that populates the grid with cells, each made alive or dead 
//according to the probability of life_chance.
Grid.prototype.make_grid = function() {
	this.cells = [];
	for (var j=0; j<this.y_dimension; j++){
		this.cells.push([]);
		for (var i =0; i<this.x_dimension; i++){
			var alive = decideFate(this.life_chance);
			//creates a cell at that location with given probability of being alive
			this.cells[j].push(new Cell(i, j, alive));
		}
	}
}

Grid.prototype.getYDimension = function(){
	return this.y_dimension;
}

Grid.prototype.getXDimension = function(){
	return this.x_dimension;
}

Grid.prototype.getLifeChance = function(){
	return this.life_chance;
}

Grid.prototype.setLifeChance = function(chance){
	this.life_chance = chance;
}

Grid.prototype.getCells = function(){
	return this.cells;
}

Grid.prototype.clearCells = function(){
	this.cells = [];
}
