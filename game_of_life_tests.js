/*
Visual tests: In a grid of size 150*150:
The grid was created with a 0.5 probability of each cell being alive, after about 50 generations, 
we observe structures such as the pulsar, the switch and toad (oscillatory structure) that emerge.
The game was left to run for much longer and even then the oscillatory structures kept moving.
*/


test("testing cell methods", function(){
	//creating a live cell
	var current_cell = new Cell(5, 10, false);
	equal(current_cell.getX(), 5, " Get the x coordinate of a cell");
	equal(current_cell.getY(), 10, " Get the y coordinate of a cell");
	equal(current_cell.isAlive(), false, "Check that the cell is indeed dead");
	//make cell alive
	current_cell.takeBirth();
	equal(current_cell.isAlive(),true, "Check that the cell is indeed alive after calling takeBirth");
	//kill cell
	current_cell.die();
	equal(current_cell.isAlive(),false, "Check that the cell is indeed dead after calling die");
});

test("testing grid methods", function(){
	var my_grid = new Grid(5, 6, 0.5);
	my_grid.make_grid();

	//get the grid cells
	var gridcells = my_grid.getCells();
	//check number of rows, y-dimension
	equal(gridcells.length, 6, "checks that the grid has the appropriate number of rows");
	for (var i =0; i < gridcells.length; i++){
		equal(gridcells[i].length, 5, "checks that the grid has the appropriate number of columns in each row");
	};

});

test("testing logic : getNumberOfNeighbors, makeCellALiveOrNot, killCellOrNot, applyGameOflifeLogic ", function() {
	var my_grid = new Grid(10, 10, 0);
	my_grid.make_grid(); //makes a 10*10 grid with all cells dead

	var my_grid_2 = new Grid(10, 10, 0);
	my_grid_2.make_grid();

	//placing live cells
	//final grid: (A represents live cells)
	//	A A - - - - - - - - 
	//	A A A A A A - - A A 
	//	- - - A A A - - - - 
	//	A - - A A A - - - - 
	//	- - - - - - - - A - 
	//	- - - - - - - A A - 
	//	- - A - - - - - - - 
	//	- - - - - - - - - - 
	//	- - - - - - - -  A A 
	//	- - - - - - - -  A A 
	var grid_cells = my_grid.getCells()
	grid_cells[0][0].takeBirth(); // Marks a cell that is tested for the number of neighbors
	grid_cells[0][1].takeBirth();
	grid_cells[1][0].takeBirth();
	grid_cells[1][1].takeBirth();
	grid_cells[1][3].takeBirth();
	grid_cells[1][4].takeBirth();
	grid_cells[1][5].takeBirth();
	grid_cells[1][8].takeBirth();
	grid_cells[1][9].takeBirth(); //
	grid_cells[1][2].takeBirth(); //
	grid_cells[2][3].takeBirth();
	grid_cells[2][4].takeBirth(); //
	grid_cells[2][5].takeBirth();
	grid_cells[3][0].takeBirth(); //
	grid_cells[3][3].takeBirth();
	grid_cells[3][4].takeBirth();
	grid_cells[3][5].takeBirth();
	grid_cells[4][8].takeBirth(); //
	grid_cells[5][7].takeBirth(); //
	grid_cells[5][8].takeBirth(); 
	grid_cells[6][2].takeBirth(); //
	grid_cells[8][8].takeBirth();
	grid_cells[8][9].takeBirth();
	grid_cells[9][8].takeBirth();
	grid_cells[9][9].takeBirth(); //

	//Checking that the number of neighbors is being properly calculated
	equal(getNumberOfNeighbors(my_grid, 0, 0), 3, "Cell at upper-left corner with 3 neighbors");
	equal(getNumberOfNeighbors(my_grid,9, 1), 1, "Cell at an edge with 1 neighbor horizontally");
	equal(getNumberOfNeighbors(my_grid,4, 2), 8, "Cell in the center with 8 neighbors, some diagonal to it");
	equal(getNumberOfNeighbors(my_grid,0, 3), 0, "Cell at an edge with 0 neighbors");
	equal(getNumberOfNeighbors(my_grid,8, 4), 2, "Cell in the center with 2 neighbors, one diagonal to it");
	equal(getNumberOfNeighbors(my_grid,7, 5), 2, "Cell in the center with 2 neighbors");
	equal(getNumberOfNeighbors(my_grid,2, 6), 0, "Cell in the center with 0 neighbors");
	equal(getNumberOfNeighbors(my_grid,9, 9), 3, "Cell in lower-right corner with 3 neighbors");

	//making my_grid_2 an exact copy of my_grid
	var grid_cells_2 = my_grid_2.getCells()
	grid_cells_2[0][0].takeBirth(); // Marks a cell that is tested for the number of neighbors
	grid_cells_2[0][1].takeBirth();
	grid_cells_2[1][0].takeBirth();
	grid_cells_2[1][1].takeBirth();
	grid_cells_2[1][3].takeBirth();
	grid_cells_2[1][4].takeBirth();
	grid_cells_2[1][5].takeBirth();
	grid_cells_2[1][8].takeBirth();
	grid_cells_2[1][9].takeBirth(); //
	grid_cells_2[1][2].takeBirth(); //
	grid_cells_2[2][3].takeBirth();
	grid_cells_2[2][4].takeBirth(); //
	grid_cells_2[2][5].takeBirth();
	grid_cells_2[3][0].takeBirth(); //
	grid_cells_2[3][3].takeBirth();
	grid_cells_2[3][4].takeBirth();
	grid_cells_2[3][5].takeBirth();
	grid_cells_2[4][8].takeBirth(); //
	grid_cells_2[5][7].takeBirth(); //
	grid_cells_2[5][8].takeBirth(); 
	grid_cells_2[6][2].takeBirth(); //
	grid_cells_2[8][8].takeBirth();
	grid_cells_2[8][9].takeBirth();
	grid_cells_2[9][8].takeBirth();
	grid_cells_2[9][9].takeBirth(); //

	//checking makeCellAliveOrNOt and KillCellOrNot
	 equal(killCellOrNot(my_grid, 4, 2), true, "A live cell with 8 neighbors that should be killed");
	 equal(killCellOrNot(my_grid, 1, 1), true, "A live cell with 4 neighbors that should be killed");
	 equal(killCellOrNot(my_grid, 9, 1), true, "A live cell with 1 neighbors that should be killed");
	 equal(killCellOrNot(my_grid, 8, 5), false, "A live cell with 2 neighbors that should not be killed");
	 equal(killCellOrNot(my_grid, 9, 9), false, "A live cell with 3 neighbors that should not be killed");


	 equal(makeCellAliveOrNot(my_grid, 1, 5), false, "A dead cell with 1 neighbor that should not be made alive");
	 equal(makeCellAliveOrNot(my_grid, 9, 4), false, "A dead cell with 2 neighbors that should not be made alive");
	 equal(makeCellAliveOrNot(my_grid, 4, 0), true, "A dead cell with 3 neighbors that should be made alive");
	 equal(makeCellAliveOrNot(my_grid, 2, 2), false, "A dead cell with 5 neighbors that should be made alive");


	 //Now run the game of life logic on grid_2 and test if the above changes were made
	 applyGameOfLifeLogic(my_grid_2);
	 var grid_cells_3 = my_grid_2.getCells();
	 //checking if changes were made
	 equal((grid_cells_3[5][8]).isAlive(),true, "A live cell with 2 neighbors that should not have been killed");
	 equal((grid_cells_3[9][9]).isAlive(),true, "A live cell with 3 neighbors that should not have been killed");
	 equal((grid_cells_3[2][4]).isAlive(),false, "A live cell with 8 neighbors that should have been killed");
	 equal((grid_cells_3[1][1]).isAlive(),false, "A live cell with 4 neighbors that should have been killed");
	 equal((grid_cells_3[1][9]).isAlive(),false, "A live cell with 1 neighbors that should have been killed");

	 equal((grid_cells_3[5][1]).isAlive(),false, "A dead cell with 1 neighbor that should not have been made alive");
	 equal((grid_cells_3[9][4]).isAlive(),false, "A dead cell with 2 neighbors that should not have been made alive");
	 equal((grid_cells_3[0][4]).isAlive(),true, "A dead cell with 3 neighbors that should have been made alive");
	 equal((grid_cells_3[2][2]).isAlive(),false, "A dead cell with 5 neighbors that should not have been made alive");
	 
});

test("testing logic : makeChangesToGrid", function() {
	var my_grid_4 = new Grid(6, 3, 0);
	my_grid_4.make_grid(); //makes a 6*3 grid with all cells dead

	var grid_cells_4 = my_grid_4.getCells();
	// make some live cells
	(grid_cells_4[0][0]).takeBirth();
	(grid_cells_4[0][1]).takeBirth();
	(grid_cells_4[0][2]).takeBirth();

	//current_grid configuration:
	// A A A - - -
	// - - - - - -
	// - - - - - -

	kill_cells = [(grid_cells_4[0][0]), (grid_cells_4[0][1]), (grid_cells_4[0][2])];
	make_alive_cells = [(grid_cells_4[1][0]), (grid_cells_4[1][1]), (grid_cells_4[1][2])];
	makeChangesToGrid(kill_cells, make_alive_cells);

	//current_grid configuration:
	// - - - - - -
	// A A A - - -
	// - - - - - -

	for (var i = 0; i < kill_cells.length; i++){
		equal(kill_cells[i].isAlive(), false, "A cell that was previosuly alive but marked to be killed")
	}

	for (var i = 0; i < make_alive_cells.length; i++){
		equal(make_alive_cells[i].isAlive(), true, "A cell that was previosuly dead but marked to be made alive")
	}

});




