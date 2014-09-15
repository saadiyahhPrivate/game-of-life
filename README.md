Project 1 :Game of Life
=================

Highlights
-------------
- Creating a Grid, scaling cells and associating it with a canvas: 
*the grid can be created without a canvas, then the canvas (pad) is associated to the grid in the set_up_canvas_and_colors function which calculates the scaling for the cell elements. Thus the grid can be created with arbitrary dimensions and it will be scaled to fit the canvas. *
*In addition, the set_up_canvas_and_colors function can be modified easily for phase 2 of the project because the grid has very limited dependency on the canvas*

- The logic for generating the next generation: 
*To prevent concurrent modification of the grid, the changes to be made are divided into two separate arrays: cellsToKill and cellsToGiveBirthTo. After the whole grid has been scanned, the changes are then executed. A separate logic manages live and dead cells, hence making the code more modular.*

Design challenges
-------------------------
- The challenge there was to prevent concurrent modification of the grid when deciding which cells to kill/make alive in the next generation.
- The options included: 
1. Making a copy of the grid and altering that copy after visiting each cell of the original grid. Then using the copy as the next generation.
2. marking what changes have to be made and then executing them when the whole grid has been scanned
 - I chose option 2 because making a copy of the whole grid would be flow and expensive and updating the grid would take much more time, increasing with the size of the array.

Design Decision:
----------------------
- The grid is represented as an array of arrays, the high level array represents each row of the grid and the low level ones indicate the cell in each column of the grid. The grid indices work as follows: the (0,0) index sis at the upper left hand side and the indices increase to the right and downwards. A cell's location is defined as the coordinates of its upper left corner.

- The grid is made to not be wrap-around. Thus, when a cell reaches any of the edges of the grid, it cannot affect the cells on the other complementary  side of the grid. The game is supposed to be infinite, so it made sense that an element on the rightmost part of the grid cannot affect an element on the left!

- Testing: Multiple logic functions in game_of_life.js were tested under one test in the test module, this is so as not to have to create a separate grid for testing each of these behaviors

Help Wanted:
------------------
- Currently, the game is designed to move to the next generation when:
	showGridOnCanvas(current_grid);
is run. However, in the current implementation, I run this function periodically in the main function. However, I do not see a way to stop the game. Is there a way I can enable running the game and stopping it?

