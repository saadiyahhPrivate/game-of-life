					//**********general helpers

//a random number selector: if number < chance, return true, else false
var decideFate = function(number){
	var random = Math.random();
	if (random < number){
		return true;
	}
	else{
		return false;
	}
}

//defining some colors for use
var black = Color(0,0,0);
var red = Color(255,0,0);
var green = Color(0,255,0);
var blue = Color(0,0,255);

//creating a general pad element for the canvas, canvas size == 400px*400px
pad = Pad(document.getElementById('canvas'));
pad.clear();

//setting constants for drawing the grids on the pad
var MAX_X = 20; //number of square horizontally
var MAX_Y = 20; //number of squares vertically
var x_factor = pad.get_width() / MAX_X;
var y_factor = pad.get_height() / MAX_Y;


//handling some drawing details
//draw a live cell at the given coordinates
var draw_live_cell = function(x, y){
	pad.draw_square(Coord(x*x_factor, y*y_factor),x_factor, blue, green);
}

//draw a dead cell at the given coordinate
var draw_dead_cell = function(x, y){
	pad.draw_square(Coord(x*x_factor, y*y_factor),y_factor, blue, black);
}


//draw frame of the pad
pad.draw_rectangle(Coord(0, 0), pad.get_width(), pad.get_height(), 10, black);
//pad.draw_rectangle(Coord(0, 0), 100, 100, 10, red);


//////////////////////////////////////////////////////////////////////////////////////

					//********** the cell 

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

//////////////////////////////////////////////////////////////////////////////////////
				
				//*********** The grid (an array fo arrays)

function Grid(x_dimension, y_dimension, life_chance){
	this.x_dimension = x_dimension;
	this.y_dimension = y_dimension;
	this.life_chance = life_chance;
	this.cells = []

}

Grid.prototype.make_grid = function() {
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

Grid.prototype.getCells = function(){
	return this.cells;
}

//function that calculates the number of neighbors around a particular cell
var getNumberOfNeighbors = function(grid,x, y){
	var gridCells = grid.getCells();
	var numNeighbors = 0;
	for (var j = -1; j < 2; j++){
		for (var i= -1; i < 2; i++){
			if (!((j===0) && (i===0))){ //if we are not looking at the current cell
				//if the neighbors lie within the grid area (defined by the dimensions)
				if ( ((y+j) >=0) && ((y+j) <grid.getYDimension()) && ((x+i) >=0) && ((x+i) <grid.getXDimension())){
					if (gridCells[y+j][x+i].isAlive()){
						numNeighbors +=1;
					}
				}
			}
		}
	}
	return numNeighbors;
}

//a function called on a dead cell
//returns true if cell is to be made alive
var makeCellAliveOrNot = function(grid, x, y){
	var current_cell = grid.getCells()[y][x];
	var numberOfNeighbors = getNumberOfNeighbors(grid, x, y);
	if (numberOfNeighbors === 3){
		return true;
	}
	else{
		return false;
	}
}

//a function called on a live cell
//returns true if cell should be killed, false otherwise
var killCellOrNot = function(grid, x, y){
	var current_cell = grid.getCells()[y][x];
	var numberOfNeighbors = getNumberOfNeighbors(grid, x, y);
	if ((numberOfNeighbors > 3)|| (numberOfNeighbors<2)){
		return true;
	}
	else{
		return false;
	}
}

//////////////////////////////////////////////////////////////////////////////////////

				//********** the logic

//prepares the changes to be made for thenext generation of the game, 
//stores what cells to kill / give birth to and calls the function to make the changes changes
var applyGameOfLifeLogic = function(grid){
	var cellsToKill = [];
	var cellsToGiveBirthTo = [];
	var gridCells = grid.getCells();
	for (var j =0; j <grid.getYDimension(); j++){
		for (var i=0; i <grid.getXDimension(); i++){
			if (gridCells[j][i].isAlive()){
				if (killCellOrNot(grid, i, j)){
					cellsToKill.push(gridCells[j][i]);
				}
			}
			else{
				if(makeCellAliveOrNot(grid, i, j)){
					cellsToGiveBirthTo.push(gridCells[j][i]);
				}
			}
		}
	}
	makeChangesToGrid(cellsToKill, cellsToGiveBirthTo);
}

//actually makes the changes to the grid given the arrays of who to kill/ make alive
var makeChangesToGrid = function(kill, giveBirth){
	for (var a =0; a < kill.length; a++){
		kill[a].die();
	}
	for (var b =0; b < giveBirth.length; b++){
		giveBirth[b].takeBirth();
	}
}

//////////////////////////////////////////////////////////////////////////////////////

				//********** showing it on the screen

var showGridOnCanvas = function(grid){
	var gridCells = grid.getCells();
	for (var j =0; j <grid.getYDimension(); j++){
		for (var i=0; i <grid.getXDimension(); i++){
			if (gridCells[j][i].isAlive()){
				draw_live_cell(i, j);
			}
			else{
				draw_dead_cell(i, j);
			}
		}
	}
	//make a timer that causes it to update at regular intervals?
	applyGameOfLifeLogic(grid);
}

// start the game of life
var main = function(){
	var interval = 1000;
	var current_grid = new Grid(20, 20, 0.5);
	current_grid.make_grid();
	showGridOnCanvas(current_grid);
	setInterval(function(){showGridOnCanvas(current_grid)}, interval);
}

main();
