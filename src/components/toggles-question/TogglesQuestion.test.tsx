/* eslint-disable testing-library/no-node-access */

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import * as util from "../../util";
import TogglesQuestion from "./TogglesQuestion";
import {Question} from "../../types/Question";

const question: Question = {
  title: "An animal cell contains:",
  parts: [
    {
      options: ["Cell wall", "Ribosomes"],
      answer: "Cell wall"
    },
    {
      options: ["Cytoplasm", "Chloroplast"],
      answer: "Cytoplasm"
    },
    {
      options: ["Partial membrane", "Impermeable membrane"],
      answer: "Impermeable membrane"
    }
  ]
}

beforeEach(() => {
  const shuffleArraySpy = jest.spyOn(util, 'shuffleArray')
  shuffleArraySpy.mockImplementation(_ => { })

  const randomNumberSpy = jest.spyOn(util, 'randomNumber')
  randomNumberSpy.mockImplementation((min: number, _: number) => {
    return min
  })
})

test('renders the component', () => {
  const { asFragment } = render(<TogglesQuestion question={question} />);

  expect(asFragment()).toMatchSnapshot();

  expect((screen.getByText("Cell wall").parentElement as Element).className).toBe("toggle-option selected")
  expect((screen.getByText("Chloroplast").parentElement as Element).className).toBe("toggle-option selected")
  expect((screen.getByText("Partial membrane").parentElement as Element).className).toBe("toggle-option selected")
});

test('toggling an option marks it as selected', () => {
  const {asFragment} = render(<TogglesQuestion question={question} />);

  const toggle = screen.getByText("Ribosomes").parentElement as Element
  fireEvent.click(toggle)

  expect(asFragment()).toMatchSnapshot()
  expect(toggle.className).toBe( "toggle-option selected")
  expect((screen.getByText("Cell wall").parentElement as Element).className).toBe("toggle-option ")
});

test('marking last incorrect answer correct updates status text', () => {
  const { asFragment } = render(<TogglesQuestion question={question} />);

  const statusText = screen.getByText("The answer is incorrect")

  const toggle1 = screen.getByText("Cytoplasm").parentElement as Element
  fireEvent.click(toggle1)

  const toggle2 = screen.getByText("Impermeable membrane").parentElement as Element
  fireEvent.click(toggle2)

  expect(asFragment()).toMatchSnapshot()
  expect(statusText.innerHTML).toBe("The answer is correct!")
});

test('marking last incorrect answer correct locks toggles', () => {
  const { asFragment } = render(<TogglesQuestion question={question} />);

  const toggle1 = screen.getByText("Cytoplasm").parentElement as Element
  fireEvent.click(toggle1)

  const toggle2 = screen.getByText("Impermeable membrane").parentElement as Element
  fireEvent.click(toggle2)

  const lockedToggle = screen.getByText("Ribosomes").parentElement as Element
  fireEvent.click(lockedToggle)

  expect(asFragment()).toMatchSnapshot()
  expect(lockedToggle.className).toBe("toggle-option ")
});

test('correctness class changes as more options are answered correct', () => {
  render(<TogglesQuestion question={question} />);

  const container = screen.getByText("An animal cell contains:").parentElement as Element
  expect(container.className).toBe("toggles-question incorrect")

  const toggle1 = screen.getByText("Cytoplasm").parentElement as Element
  fireEvent.click(toggle1)
  expect(container.className).toBe("toggles-question partially-correct")

  const toggle2 = screen.getByText("Impermeable membrane").parentElement as Element
  fireEvent.click(toggle2)
  expect(container.className).toBe("toggles-question correct")

  const lockedToggle = screen.getByText("Ribosomes").parentElement as Element
  fireEvent.click(lockedToggle)
});


