import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const SimpleElement = () => <div data-testid="myElement">Hello, World!</div>;

test('renders a simple element and checks if it is in the document', () => {
  render(<SimpleElement />);

  const element = screen.getByTestId('myElement');

  expect(element).toBeInTheDocument();
});