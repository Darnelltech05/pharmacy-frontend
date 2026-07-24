import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SA MedConnect landing page', () => {
  render(<App />);
  const titleElement = screen.getByText(/Bridging the Healthcare Gap/i);
  expect(titleElement).toBeInTheDocument();
});
