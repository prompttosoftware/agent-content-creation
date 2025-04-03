import React from 'react';
import { render, screen } from '@testing-library/react';
import HelloWorld from './HelloWorld';

test('renders "Hello, world!"', () => {
  render(<HelloWorld />);
  const linkElement = screen.getByText(/Hello, world!/i);
  expect(linkElement).toBeInTheDocument();
});