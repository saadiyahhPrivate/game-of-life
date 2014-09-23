//////////////////////////////////////////////////////////////////////////////////////
					
					//  CREATING THE CANVAS

//This function creates the canvas and a few global colors to be used in the
//canvas. It also sets the scale factors for drawing cells
//It then draws a frame that defined the contour of the canvas.
var set_up_canvas_and_colors = function(x, y){//defining some colors for use
	window.black = Color(0,0,0);
	window.red = Color(255,0,0);
	window.green = Color(0,255,0);
	window.blue = Color(0,0,255);

	//creating a general pad element for the canvas, canvas size == 400px*400px
	window.pad = Pad(document.getElementById('canvas'));
	pad.clear();

	// Setting the scaling factors to draw cells on the grid
	window.x_factor = pad.get_width()/ x;
	window.y_factor = pad.get_height()/ y;
}


//////////////////////////////////////////////////////////////////////////////////////

					//  GENERAL HELPERS

//This function is a random number selector that decides if a cell will
//be alive or not: if number < chance, return true (cell alive), else false(not alive)
var decideFate = function(number){
	var random = Math.random();
	if (random < number){
		return true;
	}
	else{
		return false;
	}
}


//Each helper from lecture
var each = function(iterable, f){
	var l = iterable.length;
	for (var i = 0; i< l; i++){
		f(iterable[i]);
	}
}

//from to from lecture
from_to = function (from, to, f) {
	if (from >= to) return;
	f(from); 
	from_to(from+1, to, f);
}


//////////////////////////////////////////////////////////////////////////////////////

					//  THE GAME OF LIFE LOGIC

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

//a function called on a dead cell that returns true if cell is to be
// made alive in the next generation
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

//A function called on a live cell that returns true if cell should 
//be killed  in the next generation, false otherwise
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

//prepares the changes to be made for the next generation of the game, 
//stores what cells to kill / give birth to and calls the function (make ChangesToGrid)
//to then make the changes changes
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

//Actually makes the changes to the grid given the arrays of who to kill/ make alive
//thus updating the grid to the next generation of cells
var makeChangesToGrid = function(kill, giveBirth){
	for (var a =0; a < kill.length; a++){
		kill[a].die();
	}
	for (var b =0; b < giveBirth.length; b++){
		giveBirth[b].takeBirth();
	}
}

//////////////////////////////////////////////////////////////////////////////////////
					//  Displaying game of life on the DOM- generating table etc

//A function that is called when the game is started and interacted with only through the DOM
var run_on_dom = function(){
	var dimensions = 50;
	var probability = 0.5;
	var my_grid = new Grid(dimensions, dimensions, probability); //create a grid of the specified dimensions
	my_grid.make_grid();
	var time_interval = 100;
	var set_interval_ID = 0; //initially id is zero
	var game_running = false; // an indicator if a game is currently running or not

	//Make the buttons and create the table representing the grid of cells
	var construct_all_DOM_elements = function(){
		construct_buttons();
		construct_html_table();
	}

	//This initialises all the buttons for the button section of the DOM
	var construct_buttons = function(){
		var startButton = $("<button>", {
			id: "Start", text: "Start", click: on_Start_Click
		});

		var pauseButton = $("<button>", {
			id: "Pause", text: "Pause", click: on_Pause_Click
		});

		var stepButton = $("<button>", {
			id: "Step", text: "Step", click: on_Step_Click
		});

		var restartButton = $("<button>", {
			id: "Restart", text: "Restart", click: on_Restart_Click
		});

		//now add the button to the layout for buttons
		$("#my_buttons").append(startButton);
		$("#my_buttons").append(pauseButton);
		$("#my_buttons").append(stepButton);
		$("#my_buttons").append(restartButton);
	}

	// Create a table with all cells aparently dead
	var construct_html_table = function(){
		var grid_table = $("<table>").attr("id", "current_table");
		$("#my_display_grid").append(grid_table);
		for (var i =0; i< dimensions; i++){
			var row = $("<tr>");
			for (var j=0; j< dimensions; j++){
				row.append($("<td>").addClass("is_not_alive"));
			}
			grid_table.append(row);
		}
	}

	// Reflect the grid situation on the DOM
	var make_DOM_reflect_current_table_state = function(){
		var my_grid_cells = my_grid.getCells();
		for (var y =0; y< dimensions; y++){
			for (var x =0; x < dimensions; x++){
				if ((my_grid_cells[y][x]).isAlive()){
					$(current_table.rows[y].cells.item(x)).attr("class", "is_alive");
				}
				else{
					$(current_table.rows[y].cells.item(x)).attr("class", "is_not_alive");
				}
			}
		}
	}

	// Go through one generation
	var update_one_generation = function(){
		applyGameOfLifeLogic(my_grid);
		make_DOM_reflect_current_table_state();
	}

	//Specifying the behavior of buttons

	//can only be activated if the game is not running
	var on_Start_Click = function(){
		if (!game_running){
			game_running = true;
			set_interval_ID = setInterval(update_one_generation, time_interval);
		}
	}

	// can only be activated if the game is running
	var on_Pause_Click = function(){
		if (game_running){
			clearInterval(set_interval_ID);
			set_interval_ID = 0;
		}
	}

	// can only be activated when the game has been paused
	var on_Step_Click = function(){
		if(game_running && (set_interval_ID===0)){
			update_one_generation();
		}
	}

	// can be activated anytime
	var on_Restart_Click = function(){
		if (game_running){
			clearInterval(set_interval_ID);
			game_running= false;
		}
		set_interval_ID =0;
		my_grid.make_grid();
		make_DOM_reflect_current_table_state();
	}

	//actually runs the command that creates the buttons and the table(grid)
	construct_all_DOM_elements();
}

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
