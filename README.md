Project 1 :Game of Life
=================

Highlights
-------------
- Creating a Grid, scaling cells and associating it with a canvas: 
*the grid can be created without a canvas, then the canvas (pad) is associated to the grid in the set_up_canvas_and_colors function which calculates the scaling for the cell elements. Thus the grid can be created with arbitrary dimensions and it will be scaled to fit the canvas. *
*In addition, the set_up_canvas_and_colors function can be modified easily for phase 2 of the project because the grid has very limited dependency on the canvas*

- The logic for generating the next generation: 
*To prevent concurrent modification of the grid, the changes to be made are divided into two separate arrays: cellsToKill and cellsToGiveBirthTo. After the whole grid has been scanned, the changes are then executed. A separate logic manages live and dead cells, hence making the code more modular.*

- The grid is made into a table element that merely dictates how the cells are displayed. Due tot he modularity achieved in phase 1, minimal changes were required to implement the features described in the design section.

- The title, buttons and grid are always centered when the browser is resized.

Design challenges Phase 1
------------------------------------
- The challenge there was to prevent concurrent modification of the grid when deciding which cells to kill/make alive in the next generation.
- The options included: 
1. Making a copy of the grid and altering that copy after visiting each cell of the original grid. Then using the copy as the next generation.
2. marking what changes have to be made and then executing them when the whole grid has been scanned
 - I chose option 2 because making a copy of the whole grid would be flow and expensive and updating the grid would take much more time, increasing with the size of the array.

Design Decision Phase 1:
----------------------------------
- The grid is represented as an array of arrays, the high level array represents each row of the grid and the low level ones indicate the cell in each column of the grid. The grid indices work as follows: the (0,0) index is at the upper left hand side and the indices increase to the right and downwards. A cell's location is defined as the coordinates of its upper left corner.

- The grid is made to not be wrap-around. Thus, when a cell reaches any of the edges of the grid, it cannot affect the cells on the other complementary  side of the grid. The game is supposed to be infinite, so it made sense that an element on the rightmost part of the grid cannot affect an element on the left!

- Testing: Multiple logic functions in game_of_life.js were tested under one test in the test module, this is so as not to have to create a separate grid for testing each of these behaviors

Design challenges Phase 2
-------------------------------------
- In order to pause and restart the game, I was confused in Phase 1 about how to proceed. Some googling revealed that setInterval returns an ID that can be used to stop the game via clearInterval. This was used to achieve the desired behavior for the buttons.

- The grid is this time represented as a table in HTML(made up of rows of cells). Initially I thought of representing each cell as a div element but instead settled for representing each as a <td> element instead so as to use the table structure. In addition, each element is given a state is_alive or is_not_alive to help represent it on the browser. 

- Rendering the current state of the cells on the browser is handled by a different function to allow for more modularity in the code. This way, the initial canvas display still works and can be launched by running Run_game_of_life_on_canvas_1.1.html. For the DOM display, please run Run_game_of_life_on_DOM_1.2.html.

Design Decision Phase 2
----------------------------------
-This time, as much as possible, I modified the code used in Phase 2 to use functionals taken from lecture.

- Additional Feature: The additional feature I chose to implement are activated through buttons. The "step" button allows the user to observe the next generation of cells. The "Reset" button clears the old grid contents and generates a new grid with live cells placed randomly it. Finally, the "Gun" button creates a gun structure on the grid and pressing "Start" sets it off.

-The "step", "gun" buttons can only be activated when the game is not running or paused. Otherwise, the "Reset" button can be activated anytime and run using "Start". This is because, ti makes sense to only be able to step through a game that is currently stationary and to create a gun configuration only when the user is not observing a game already.

- Note: the test file was useful in switching from for loops to functionals as they would readily indicate errors.

Help Wanted:
------------------
- Currently, the game is designed to move to the next generation when:
	showGridOnCanvas(current_grid);
is run. However, in the current implementation, I run this function periodically in the start_with_given_config function. However, I do not see a way to stop the game. Is there a way I can enable running the game and stopping it?

- Update: I googled setInterval and found a solution to this which I used in my implementation. In short, I used the ID returned by setInterval.
