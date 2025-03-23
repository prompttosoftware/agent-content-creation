// tests/videoGenerator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateGridSize, positionAgentsInGrid } from '../src/video/videoGenerator';

describe('videoGenerator', () => {
  it('calculateGridSize returns correct dimensions', () => {
    expect(calculateGridSize(1)).toEqual({ rows: 1, cols: 1 });
    expect(calculateGridSize(4)).toEqual({ rows: 2, cols: 2 });
    expect(calculateGridSize(5)).toEqual({ rows: 3, cols: 2 });
  });

  it('positionAgentsInGrid returns correct positions', () => {
    const containerWidth = 400;
    const containerHeight = 300;
    expect(positionAgentsInGrid(1, containerWidth, containerHeight)).toEqual([
      { x: 0, y: 0, width: 400, height: 300 },
    ]);
    expect(positionAgentsInGrid(4, containerWidth, containerHeight)).toEqual([
      { x: 0, y: 0, width: 200, height: 150 },
      { x: 200, y: 0, width: 200, height: 150 },
      { x: 0, y: 150, width: 200, height: 150 },
      { x: 200, y: 150, width: 200, height: 150 },
    ]);
  });
});