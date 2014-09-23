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


//This is the Each iterator helper from lecture
var each = function(iterable, f){
	var l = iterable.length;
	for (var i = 0; i< l; i++){
		f(iterable[i]);
	}
}

//This is the from_to from lecture to iterate through a range
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

	from_to(-1, 2, function(row){
		var row_at = (y+row);
		from_to(-1, 2, function(column){
			var column_at = (x+column);
			if (!((row===0) && (column===0))){ //if we are not looking at the current cell
				if (lies_within_grid(grid, y+row, x+column)){ //if the cell we are looking at is within bounds
					if (gridCells[row_at][column_at].isAlive()){
						numNeighbors +=1;
					}
				}
			}
		})
	});
	return numNeighbors;
}

//a function that checks if a given location lies within the grid
var lies_within_grid = function(grid,row, column){
	if ((row) >=0 && row < grid.getYDimension() && (column) >=0 && column < grid.getXDimension()){
		return true;
	}
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

	from_to(0, grid.getYDimension(), function(row){
		var row_at = row;
		from_to(0, grid.getXDimension(), function(column){
			var column_at = column;
			if (gridCells[row_at][column_at].isAlive()){
				if (killCellOrNot(grid, column_at, row_at)){
					cellsToKill.push(gridCells[row_at][column_at]);
				}
			}
			else{
				if(makeCellAliveOrNot(grid, column_at, row_at)){
					cellsToGiveBirthTo.push(gridCells[row_at][column_at]);
				}
			}
		})
	});
	makeChangesToGrid(cellsToKill, cellsToGiveBirthTo);
}

//Actually makes the changes to the grid given the arrays of who to kill/ make alive
//thus updating the grid to the next generation of cells
var makeChangesToGrid = function(kill, giveBirth){
	each(giveBirth, function(cell){
		cell.takeBirth();
	});

	each(kill, function(cell){
		cell.die();
	});
}

//////////////////////////////////////////////////////////////////////////////////////
					//  Displaying game of life on the DOM- generating table etc

//A function that is called when the game is started and interacted with only through the DOM
var run_on_dom = function(){
	var dimensions = 50;
	var probability = 0.5;
	var my_grid = new Grid(dimensions, dimensions, probability); //create a grid of the specified dimensions
	my_grid.make_grid();
	var time_interval = 1;
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

		var gunButton = $("<button>", {
			id: "MakeGun", text: "Make Gun", click: on_Make_Gun_CLick
		});

		//now add the button to the layout for buttons
		$("#my_buttons").append(startButton);
		$("#my_buttons").append(pauseButton);
		$("#my_buttons").append(stepButton);
		$("#my_buttons").append(restartButton);
		$("#my_buttons").append(gunButton);
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

		from_to(0, dimensions, function(row){
			from_to(0, dimensions, function(column){
				if ((my_grid_cells[column][row]).isAlive()){
					$(current_table.rows[column].cells.item(row)).attr("class", "is_alive");
				}
				else{
					$(current_table.rows[column].cells.item(row)).attr("class", "is_not_alive");
				}
			})
		})
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
			game_running = false;
		}
	}

	// can only be activated when the game has been paused
	var on_Step_Click = function(){
		if((!game_running) && (set_interval_ID===0)){
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
		my_grid.setLifeChance(0.5);
		my_grid.make_grid();
		make_DOM_reflect_current_table_state();
	}

	//can only be called when the game is not running, creates a gun on the canvas!
	var on_Make_Gun_CLick = function(){
		if (!game_running){
			my_grid.setLifeChance(0);
			my_grid.make_grid(); //make a grid of all dead cells
			my_cells = my_grid.getCells();

			//now add the relevant live cells
			cellsToMakeAlive = [my_cells[5][1], my_cells[5][2], my_cells[6][1], my_cells[6][2], 
		 	my_cells[3][13], my_cells[3][14], my_cells[4][12], my_cells[4][16], my_cells[5][11], 
		 	my_cells[6][11], my_cells[7][11], my_cells[8][12], my_cells[9][13], my_cells[9][14], 
		 	my_cells[6][15], my_cells[5][17], my_cells[6][17], my_cells[7][17], my_cells[6][18], 
		 	my_cells[8][16], my_cells[1][25], my_cells[2][25], my_cells[2][23], my_cells[3][21], 
		 	my_cells[3][22], my_cells[4][21], my_cells[4][22], my_cells[5][21], my_cells[5][22], 
		 	my_cells[6][23], my_cells[6][25], my_cells[7][25], my_cells[3][35], my_cells[3][36], 
		 	my_cells[4][35], my_cells[4][36]];
			
			makeChangesToGrid([], cellsToMakeAlive);

			make_DOM_reflect_current_table_state();
		};

	}

	//actually runs the command that creates the buttons and the table(grid)
	construct_all_DOM_elements();
}
