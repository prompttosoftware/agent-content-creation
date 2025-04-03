import React from 'react';
import { render } from '@testing-library/react';
import VideoGrid from './VideoGrid';

// Mock the VideoCanvas component
jest.mock('./VideoCanvas', () => () => <div>Mocked VideoCanvas</div>);

describe('VideoGrid', () => {
  it('renders without crashing', () => {
    render(<VideoGrid />);
  });

  // Add more tests as needed, e.g., testing the layout with different props
});