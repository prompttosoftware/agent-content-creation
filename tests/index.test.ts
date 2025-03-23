// tests/index.test.ts
import { describe, it, expect, vi } from 'vitest';
import { calculateGridSize, positionAgentsInGrid } from '../src/video/videoGenerator';

describe('Grid Layout Functions', () => {
  it('calculateGridSize should return correct dimensions', () => {
    expect(calculateGridSize(1)).toEqual({ rows: 1, cols: 1 });
    expect(calculateGridSize(4)).toEqual({ rows: 2, cols: 2 });
    expect(calculateGridSize(5)).toEqual({ rows: 3, cols: 2 });
    expect(calculateGridSize(7)).toEqual({ rows: 3, cols: 3 });
  });

  it('positionAgentsInGrid should return correct positions', () => {
    const containerWidth = 400;
    const containerHeight = 300;

    expect(positionAgentsInGrid(1, containerWidth, containerHeight)).toEqual([
      { x: 0, y: 0, width: 400, height: 300 }
    ]);
    expect(positionAgentsInGrid(4, containerWidth, containerHeight)).toEqual([
      { x: 0, y: 0, width: 200, height: 150 },
      { x: 200, y: 0, width: 200, height: 150 },
      { x: 0, y: 150, width: 200, height: 150 },
      { x: 200, y: 150, width: 200, height: 150 }
    ]);
    expect(positionAgentsInGrid(5, containerWidth, containerHeight)).toEqual([
      { x: 0, y: 0, width: 200, height: 100 },
      { x: 200, y: 0, width: 200, height: 100 },
      { x: 0, y: 100, width: 200, height: 100 },
      { x: 200, y: 100, width: 200, height: 100 },
      { x: 0, y: 200, width: 200, height: 100 }
    ]);
  });

  // it('resizeGrid should log agent positions to console', () => {
  //   // This test checks if resizeGrid calls console.log with the expected output.
  //   const consoleLogSpy = vi.spyOn(console, 'log');
  //   const numberOfAgents = 4;
  //   const containerWidth = 400;
  //   const containerHeight = 300;
  //   resizeGrid(numberOfAgents, containerWidth, containerHeight);

  //   expect(consoleLogSpy).toHaveBeenCalled();
  //   // You can optionally check the logged arguments more specifically if needed
  //   consoleLogSpy.mockRestore();
  // });
});