// grid_layout_algorithm.js

/**
 * Calculates the grid layout for video agents based on the number of agents.
 *
 * @param {number} numberOfAgents The number of active video agents.
 * @returns {object} An object containing the grid layout information:
 *   - rows: The number of rows in the grid.
 *   - cols: The number of columns in the grid.
 *   - cellWidth: The width of each cell in pixels (or relative units, e.g., percentages).  This is designed to maintain a square or near-square aspect ratio.
 *   - cellHeight: The height of each cell in pixels (or relative units).
 */
function calculateGridLayout(numberOfAgents) {
  let rows, cols, cellWidth, cellHeight;

  switch (numberOfAgents) {
    case 1:
      rows = 1;
      cols = 1;
      cellWidth = 100; // Assuming 100% of the container width
      cellHeight = 100; // Assuming 100% of the container height
      break;
    case 2:
      rows = 1;
      cols = 2;
      cellWidth = 50; // Half the width for two columns
      cellHeight = 100;
      break;
    case 3:
      rows = 2;
      cols = 2; // Optimized for 3.  2x2, with one empty spot.  More space efficient than 1x3 or 3x1.
      cellWidth = 50;
      cellHeight = 50; // Approximating square
      break;
    case 4:
      rows = 2;
      cols = 2;
      cellWidth = 50;
      cellHeight = 50;
      break;
    case 5:
      rows = 2;
      cols = 3;
      cellWidth = 33.3333; // Approximate third of the container width
      cellHeight = 50;  // Approx. half the container height
      break;
    case 6:
      rows = 2;
      cols = 3;
      cellWidth = 33.3333;
      cellHeight = 50;
      break;
    case 7:
      rows = 3;
      cols = 3;
      cellWidth = 33.3333;
      cellHeight = 33.3333;
      break;
    case 8:
      rows = 3;
      cols = 3;
      cellWidth = 33.3333;
      cellHeight = 33.3333;
      break;
    case 9:
      rows = 3;
      cols = 3;
      cellWidth = 33.3333;
      cellHeight = 33.3333;
      break;
    case 10:
      rows = 3;
      cols = 4;
      cellWidth = 25;
      cellHeight = 33.3333;
      break;
    case 11:
      rows = 3;
      cols = 4;
      cellWidth = 25;
      cellHeight = 33.3333;
      break;
    case 12:
      rows = 3;
      cols = 4;
      cellWidth = 25;
      cellHeight = 33.3333;
      break;

    default:
      // For more than 12 agents, try to maintain near-square cells.
      // Determine the optimal number of rows and columns that are close to each other
      const sqrt = Math.sqrt(numberOfAgents);
      rows = Math.floor(sqrt);
      cols = Math.ceil(numberOfAgents / rows); // Ensure all agents are displayed
      if (rows * (cols -1) >= numberOfAgents ) {
          cols--;
      }
      if (rows * cols < numberOfAgents) {
          rows++;
          cols = Math.ceil(numberOfAgents / rows);
      }
      if (rows > cols) {
          const temp = rows;
          rows = cols;
          cols = temp;
      }

      cellWidth = 100 / cols;
      cellHeight = 100 / rows;
      break;
  }

  return {
    rows: rows,
    cols: cols,
    cellWidth: cellWidth,
    cellHeight: cellHeight,
  };
}

// Example usage:
// const layout = calculateGridLayout(7);
// console.log(layout); // { rows: 3, cols: 3, cellWidth: 33.3333, cellHeight: 33.3333 }

// const layout1 = calculateGridLayout(1);
// console.log(layout1); // { rows: 1, cols: 1, cellWidth: 100, cellHeight: 100 }

// const layout2 = calculateGridLayout(15);
// console.log(layout2); // Example result for 15:  rows: 4, cols: 4, cellWidth: 25, cellHeight: 25

// const layout3 = calculateGridLayout(16);
// console.log(layout3); // rows: 4, cols: 4, cellWidth: 25, cellHeight: 25