// grid_layout_algorithm.js

/**
 * Calculates the grid layout for video agents based on the number of agents.
 * It aims for a square or near-square grid arrangement.
 *
 * @param {number} numberOfAgents The number of active video agents (must be a non-negative integer).
 * @returns {object} An object containing the grid layout information:
 *   - rows: The number of rows in the grid.
 *   - cols: The number of columns in the grid.
 *   - cellWidth: The width of each cell, expressed as a percentage of the container width (0-100).
 *   - cellHeight: The height of each cell, expressed as a percentage of the container height (0-100).
 *   Returns null if the input is invalid (e.g., not a number, negative).
 */
function calculateGridLayout(numberOfAgents) {
  // Input validation.  Return null for invalid input.
  if (typeof numberOfAgents !== 'number' || !Number.isInteger(numberOfAgents) || numberOfAgents < 0) {
    console.error("Invalid input: numberOfAgents must be a non-negative integer.");
    return null;
  }

  let rows, cols, cellWidth, cellHeight;

  switch (numberOfAgents) {
    case 0: //Handle the zero case gracefully.
      rows = 1;
      cols = 1;
      cellWidth = 100;
      cellHeight = 100;
      break;
    case 1:
      rows = 1;
      cols = 1;
      cellWidth = 100;
      cellHeight = 100;
      break;
    case 2:
      rows = 1;
      cols = 2;
      cellWidth = 50;
      cellHeight = 100;
      break;
    case 3:
      rows = 2;
      cols = 2;
      cellWidth = 50;
      cellHeight = 50;
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
      cellWidth = 33.3333;
      cellHeight = 50;
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
      // For more than 12 agents, calculate rows and columns to approach a square grid.
      const sqrt = Math.sqrt(numberOfAgents);
      rows = Math.floor(sqrt);
      cols = Math.ceil(numberOfAgents / rows);

      // Adjust to minimize the difference between rows and columns while ensuring all agents fit.
      if (rows * (cols - 1) >= numberOfAgents) {
          cols--;
      }
       if (rows * cols < numberOfAgents) {
           rows++;
           cols = Math.ceil(numberOfAgents / rows);
       }

      // Ensure rows <= cols to avoid unnecessary swapping and maintain predictable behavior.
       if (rows > cols) {
          [rows, cols] = [cols, rows]; // Swap if rows > cols
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