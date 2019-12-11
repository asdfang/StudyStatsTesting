import React, { useState } from 'react';
import { render } from '@testing-library/react';
import Graph from './Graph.js';

describe('Graph', () => {
  let classes = { "courses" : [{
                    "id": "1", "title": "class",
                    "assignments": [{"id": "2", "title": "hw", "completed": "false", "week": 1,
                    "responses": [{"time": 10, "comment": "the comment"}]}]
  }]};
  classes = classes.courses;
  let setClasses = jest.fn();

  it('renders Graph', () => {
    const {getByText, getByTestId, container} = render(<Graph key={classes.title} state={{classes, setClasses}}/>);
  });
});