import React from 'react';
import { render, getByTestId, fireEvent } from '@testing-library/react';
import Graph from './Graph.js';

describe('Graph', () => {
  let classes = { "courses" : [{
                    "id": "1", "title": "class",
                    "assignments": [{"id": "2", "title": "hw", "completed": "false", "week": 1,
                    "responses": [{"time": 10, "comment": "the comment"}]}]
  }]};
  classes = classes.courses;
  let setClasses = jest.fn();

  // renders
  test('renders Graph', () => {
    const {getByTestId} = render(<Graph key={classes.title} state={{classes, setClasses}}/>);
  });
  
  // interaction
  test('clicking on Individual Times switches graph to Scatter', () => {
    const {getByTestId} = render(<Graph key={classes.title} state={{classes, setClasses}}/>);
    fireEvent.click(getByTestId('graphDropdownButton'));
    fireEvent.click(getByTestId('individualTimesButton')); // why can't it find this?
    expect(getByTestId('chartContainer')).toBeTruthy();
    expect(getByTestId('chartContainer').firstChild.chartType).toBe('ColumnChart');
  });

});