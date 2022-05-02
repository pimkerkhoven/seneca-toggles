import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';


/**
 * - test snapshot of initial render
 * - test clicking answer toggles option
 * - test putting correct answer updates status text
 * - test putting correct answer locks toggles
 */

// TODO: move tests to correct file!

test('renders the component', () => {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});

test('toggling an option marks it as selected', () => {
  const {asFragment} = render(<App />);

  const toggle = screen.getByText("Ribosomes")
  fireEvent.click(toggle)

  expect(asFragment()).toMatchSnapshot()
  expect(toggle.className).toBe( "ToggleOption selected")
  expect(screen.getByText("Cell wall").className).toBe("ToggleOption")
});

test('marking last incorrect answer correct updates status text', () => {
  const { asFragment } = render(<App />);

  const statusText = screen.getByText("The answer is incorrect")

  const toggle = screen.getByText("Impermeable membrane")
  fireEvent.click(toggle)

  expect(asFragment()).toMatchSnapshot()
  expect(statusText.innerHTML).toBe("The answer is correct!")
});

test('marking last incorrect answer correct locks toggles', () => {
  const { asFragment } = render(<App />);

  const toggle = screen.getByText("Impermeable membrane")
  fireEvent.click(toggle)

  const lockedToggle = screen.getByText("Ribosomes")
  fireEvent.click(lockedToggle)

  expect(asFragment()).toMatchSnapshot()
  expect(lockedToggle.className).toBe("ToggleOption")
});


