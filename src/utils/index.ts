// src/utils/index.ts

export function calculateGridSize(agentCount: number): { rows: number; cols: number } {
  const size = Math.ceil(Math.sqrt(agentCount));
  const rows = size;
  const cols = Math.ceil(agentCount / size);
  return { rows, cols };
}

export function positionAgentsInGrid(agentCount: number, containerWidth: number, containerHeight: number): { x: number; y: number; width: number; height: number }[] {
    const { rows, cols } = calculateGridSize(agentCount);
    const cellWidth = containerWidth / cols;
    const cellHeight = containerHeight / rows;
    const positions: { x: number; y: number; width: number; height: number }[] = [];

    for (let i = 0; i < agentCount; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;

        positions.push({
            x: col * cellWidth,
            y: row * cellHeight,
            width: cellWidth,
            height: cellHeight,
        });
    }

    return positions;
}

export function resizeGrid(grid: {width: number; height: number}, newSize: {width: number; height: number}): {width: number; height: number} {
    return newSize;
}