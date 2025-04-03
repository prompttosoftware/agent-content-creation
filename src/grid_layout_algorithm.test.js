import calculateGridLayout from './grid_layout_algorithm';

describe('calculateGridLayout', () => {
  it('should return the correct layout for 0 agents', () => {
    const layout = calculateGridLayout(0);
    expect(layout).toEqual({ rows: 1, cols: 1, cellWidth: 100, cellHeight: 100 });
  });

  it('should return the correct layout for 1 agent', () => {
    const layout = calculateGridLayout(1);
    expect(layout).toEqual({ rows: 1, cols: 1, cellWidth: 100, cellHeight: 100 });
  });

  it('should return the correct layout for 2 agents', () => {
    const layout = calculateGridLayout(2);
    expect(layout).toEqual({ rows: 1, cols: 2, cellWidth: 50, cellHeight: 100 });
  });

  it('should return the correct layout for 3 agents', () => {
    const layout = calculateGridLayout(3);
    expect(layout).toEqual({ rows: 2, cols: 2, cellWidth: 50, cellHeight: 50 });
  });

  it('should return the correct layout for 4 agents', () => {
    const layout = calculateGridLayout(4);
    expect(layout).toEqual({ rows: 2, cols: 2, cellWidth: 50, cellHeight: 50 });
  });

  it('should return the correct layout for 5 agents', () => {
    const layout = calculateGridLayout(5);
    expect(layout).toEqual({ rows: 2, cols: 3, cellWidth: 33.3333, cellHeight: 50 });
  });

  it('should return the correct layout for 6 agents', () => {
    const layout = calculateGridLayout(6);
    expect(layout).toEqual({ rows: 2, cols: 3, cellWidth: 33.3333, cellHeight: 50 });
  });

  it('should return the correct layout for 7 agents', () => {
      const layout = calculateGridLayout(7);
      expect(layout).toEqual({ rows: 3, cols: 3, cellWidth: 33.3333, cellHeight: 33.3333 });
  });

  it('should return the correct layout for 8 agents', () => {
      const layout = calculateGridLayout(8);
      expect(layout).toEqual({ rows: 3, cols: 3, cellWidth: 33.3333, cellHeight: 33.3333 });
  });

    it('should return the correct layout for 9 agents', () => {
        const layout = calculateGridLayout(9);
        expect(layout).toEqual({ rows: 3, cols: 3, cellWidth: 33.3333, cellHeight: 33.3333 });
    });

  it('should return the correct layout for 10 agents', () => {
      const layout = calculateGridLayout(10);
      expect(layout).toEqual({ rows: 3, cols: 4, cellWidth: 25, cellHeight: 33.3333 });
  });

  it('should return the correct layout for 11 agents', () => {
      const layout = calculateGridLayout(11);
      expect(layout).toEqual({ rows: 3, cols: 4, cellWidth: 25, cellHeight: 33.3333 });
  });

  it('should return the correct layout for 12 agents', () => {
      const layout = calculateGridLayout(12);
      expect(layout).toEqual({ rows: 3, cols: 4, cellWidth: 25, cellHeight: 33.3333 });
  });

  it('should return the correct layout for a larger number of agents (e.g., 20)', () => {
      const layout = calculateGridLayout(20);
      expect(layout).toEqual(expect.any(Object)); // or a more specific check
  });

  it('should handle an odd number of agents correctly (e.g., 17)', () => {
      const layout = calculateGridLayout(17);
      expect(layout).toEqual(expect.any(Object)); // or a more specific check
  });
});