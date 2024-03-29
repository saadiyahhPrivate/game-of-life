//////////////////////////////////////////////////////////////////////////////////////

					//  DISPLAYING THE GAME OF LIFE - project 1.1 approach

//Draws a live cell at the given coordinates
var draw_live_cell = function(x, y, x_dimension, y_dimension){
	pad.draw_square(Coord(x*x_dimension, y*y_dimension),x_dimension,y_dimension, blue, green);
}

//Draws a dead cell at the given coordinate
var draw_dead_cell = function(x, y, x_dimension, y_dimension){
	pad.draw_square(Coord(x*x_dimension, y*y_dimension),x_dimension,y_dimension, blue, black);
}

//A function that draws each cell at the right location on the canvas.
var showGridOnCanvas = function(grid){
	var gridCells = grid.getCells();
	for (var j =0; j <grid.getYDimension(); j++){
		for (var i=0; i <grid.getXDimension(); i++){
			if (gridCells[j][i].isAlive()){
				draw_live_cell(i, j, x_factor, y_factor);
			}
			else{
				draw_dead_cell(i, j, x_factor, y_factor);
			}
		}
	}
	applyGameOfLifeLogic(grid);
}

// The main function starts the Game of life Randomly
var main = function(){
	var time_interval = 1;
	var width_grid = 150;
	var height_grid = 150;
	var probability_of_being_alive = 0.5;

	var current_grid = new Grid(width_grid, height_grid, probability_of_being_alive);
	set_up_canvas_and_colors(width_grid, height_grid); // does setting up and calculates the scale factors
	current_grid.make_grid(); //makes the grid, populating it with cells
	showGridOnCanvas(current_grid); //draws the grid on the canvas
	setInterval(function(){showGridOnCanvas(current_grid)}, time_interval); //updates grid at intervals
};

// start the game witha given configuration
// 0 random
// 1 gun
// this function will later be modified to take in a canvas element, configuration, size, probability
// or anything that will be required for phase 2
var start_with_given_config= function(config_number){
	var time_interval = 1;

	// creates an empty 50 * 50 grid
	if (config_number === 1){
		var width_grid = 50;
		var height_grid = 50;
		var probability_of_being_alive = 0;
	}
	// sets up a random grid
	else {
		var width_grid = 150;
		var height_grid = 150;
		var probability_of_being_alive = 0.5;
	}

	var current_grid = new Grid(width_grid, height_grid, probability_of_being_alive);
	set_up_canvas_and_colors(width_grid, height_grid); // does setting up and calculates the scale factors
	current_grid.make_grid(); //makes the grid, populating it with cells, all dead
	 
	 // place the live cells for the gun configuration
	 my_cells = current_grid.getCells();
	 if (config_number == 1){
	 	cellsToMakeAlive = [my_cells[5][1], my_cells[5][2], my_cells[6][1], my_cells[6][2], 
	 	my_cells[3][13], my_cells[3][14], my_cells[4][12], my_cells[4][16], my_cells[5][11], 
	 	my_cells[6][11], my_cells[7][11], my_cells[8][12], my_cells[9][13], my_cells[9][14], 
	 	my_cells[6][15], my_cells[5][17], my_cells[6][17], my_cells[7][17], my_cells[6][18], 
	 	my_cells[8][16], my_cells[1][25], my_cells[2][25], my_cells[2][23], my_cells[3][21], 
	 	my_cells[3][22], my_cells[4][21], my_cells[4][22], my_cells[5][21], my_cells[5][22], 
	 	my_cells[6][23], my_cells[6][25], my_cells[7][25], my_cells[3][35], my_cells[3][36], 
	 	my_cells[4][35], my_cells[4][36]];
	 	//apply changes to the grid, that is, mae the cells specified above alive
	 	makeChangesToGrid([], cellsToMakeAlive);
	 }

	showGridOnCanvas(current_grid); //draws the grid on the canvas
	setInterval(function(){showGridOnCanvas(current_grid)}, time_interval); //updates grid at intervals
}