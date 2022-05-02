# Seneca Toggles
Component that displays a question consisting of multiple parts. Each part is a toggle
that has one correct position. If all toggles are in the correct position the question
is answered.

## Question Format
Questions need to have the following format

```js
question = {
    title: "Qustion Title",
    parts: [{
        options: ["Option 1", "Option 2"],
        answer: "Option 1"
    }]
}
```

The number of options per part is unlimited in theory, but in practice using more than four or five
will give a very cluttered screen.

## Example Usage

```jsx
import TogglesQuestion from "./TogglesQuestion";

<TogglesQuestion question={question} /> 
```

The question parts and the options for each part are displayed in random order. This order
is randomized each time a new question is provided. 

Questions are __never__ initialized with more than 50% of the toggles already in the correct position.

## Assumptions
- Each question part has at least two options
- All options are unique
- The correct answer is included in the options
- All text is correctly formatted and capitalized

## Tests
The component functionality is tested. These tests can be run with `npm test`.

## Running a demo
A demo of the component with two questions preloaded can be started by running `npm start`. 
This demo includes a button to rotate through the question.

## Create React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
