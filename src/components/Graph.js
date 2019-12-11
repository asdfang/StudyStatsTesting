import React, { useState } from 'react';
import { Chart } from "react-google-charts";
import _ from 'lodash';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from 'react-bootstrap/Dropdown';

const week = 1;

// given an assignment JSON, outputs median time for that assignment
const median_time = assignment => {
  const times = assignment.responses.map(response => response.time)
                .sort((a, b) => a - b);
  const mid = _.floor(times.length / 2);
  return _.isEqual(times.length%2, 0) ? _.mean([times[mid-1], times[mid]]) : times[mid];
}

const getBarData = (data, state) => {
  let dueSoon = "";
  let maxHours = 0;
  const options = {
    title: "This Week's Assignments",
    legend: {position: 'none'},
    vAxis: {
      title: "Median Hours",
      titleTextStyle: {
        italic: false
      }
    }
  };
  for (let i = 0; i < state.classes.length; i += 1) {
    const assignments = state.classes[i].assignments;
    for (let j = 0; j < assignments.length; j += 1) {
      const assignment = assignments[j];
      const median_time_spent = median_time(assignment);
      if (_.isEqual(assignment.week, week)) {
        if (median_time_spent > maxHours){
          maxHours = median_time_spent;
          dueSoon = state.classes[i].title + " " + assignment.title;
        }
        data.push([state.classes[i].title + " " + assignment.title, median_time_spent, ''])
      }
    }
  }
  for (let i = 0; i < data.length; i += 1){
    if (_.isEqual(data[i][0], dueSoon)) {
      data[i][2] = 'red';
    }
  }
  return [data, options];
}

const getScatterData = (data, state) => {
  let dueSoon = "";
  let maxHours = 0;
  let ticks = [];
  let count = 0;
  for (let i = 0; i < state.classes.length; i += 1) {
    let assignment;
    const assignments = state.classes[i].assignments;
    for (let j = 0; j < assignments.length; j += 1) {
      let responses = [];
      assignment = assignments[j];

      for(let k = 0; k < assignment.responses.length; k++){
        let response = assignment.responses[k];
        data.push([{v: count, f: (state.classes[i].title + " " + assignment.title)}, response.time,  '<h6>Comment: </h6>' + response.comment + '<h6>Hours Spent: </h6>' + response.time, ''])
      }
      ticks.push({v: count, f:(state.classes[i].title + " " + assignment.title)})
      count++;
    }
  }
  const options = {
    tooltip: {isHtml: true},
    title: "This Week's Assignments",
    legend: {position: 'none'},
    hAxis: {ticks : ticks },
    vAxis: {
      title: "Hours Spent",
      titleTextStyle: {
        italic: false
      }
    }
  };
  console.log("DATA IS: ", data)
  return [data, options];
}

const Graph = ({state}) => {
  const [useBar, setBar] = useState(true);

  let data = [];
  let touple = [];
  let options = {};

  if (useBar) {
    data = [
      ['Assignment', 'Median Hours Spent', { role: 'style' }],
    ];
    touple = getBarData(data, state);
    data = touple[0]
    options = touple[1]
  }
  else {
    data = [
      ['Assignment', 'Hours Spent', {role: 'tooltip', type: 'string', p: { html: true }}, {role: 'style'}],
    ];
    touple = getScatterData(data, state);
    data = touple[0]
    options = touple[1]
  }

  return (
    <Col>
      <Card border="light">
        <Card.Body>
          <Card.Title><h3>Upcoming Week</h3></Card.Title>
          <DropdownButton className="dropdownButton" title="Select Chart Type">
            <Dropdown.Item onClick={() => setBar(true)}>Median Times</Dropdown.Item>
            <Dropdown.Item onClick={() => setBar(false)}>Individual Times</Dropdown.Item>
          </DropdownButton>
          <div className={"my-pretty-chart-container"}>
            {useBar ?
            <Chart
              chartType="ColumnChart"
              data={data}
              options={options}
              width="100%"
              height="300px"
              legendToggle
            /> :
            <Chart
              chartType="ScatterChart"
              data={data}
              options={options}
              width="100%"
              height="300px"
              legendToggle/>}
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
};

export default Graph;