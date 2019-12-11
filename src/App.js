import React, { useState , useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import _ from 'lodash';
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from 'react-bootstrap/Dropdown';

import Graph from './components/Graph.js';

const Nav = () => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">Study Stats</Navbar.Brand>
  </Navbar>
);

const CurrClasses = ({classes, allClasses}) => {
  // tracks whether assignment completion modal is shown or not

  const [showLog, setShowLog] = useState(false);

  // tracks the assignment that is clicked for completion
  // logItem = [currentClass, currentAssignment]
  const [logItem, setLogItem] = useState([{id: "", title: "", assignments: []}, {id: "", title: "", completed: "", responses: []}]);

  const handleClose = () => setShowLog(false);

  // when you submit an assignment, the new assignment list buttons include all previous assignments
  // minus the one submitted
  const handleSubmit = (currInfo) => {
    let newClasses = [];
    let i = 0;
    for (i; i < classes.classes.length; i += 1) {
      if (!_.isEqual(classes.classes[i], currInfo[0])) {
        newClasses.push(classes.classes[i])
      }
      else {
        let newAssignments = [];
        let j = 0;
        for (j; j < classes.classes[i].assignments.length; j += 1) {
          if (!_.isEqual(currInfo[1], classes.classes[i].assignments[j])) {
            newAssignments.push(classes.classes[i].assignments[j])
          }
        }
        newClasses.push({id: classes.classes[i].id, title: classes.classes[i].title, assignments: newAssignments});
      }
    }
    classes.setClasses(newClasses);
    setShowLog(false);
  }

  // when assignment button is clicked, bring up modal and track which class/assignment it is
  const handleShow = (currClass, currAssignment) => {
    setLogItem([currClass, currAssignment]);
    setShowLog(true);
  };

  return (
    <Col>
      <Card border="light">
        <Card.Body>
          <Card.Title><h3>Upcoming Assignments</h3></Card.Title>
          <Card.Text>
            <ButtonGroup variant="flush">
              {classes.classes.map(currClass =>
                currClass.assignments.map(currAssignment =>

                <React.Fragment key={currAssignment.title}>
                <Button data-cy="assignmentButton" onClick={() => handleShow(currClass, currAssignment)}>{currClass.title} - {currAssignment.title}</Button>
                <br />
                </React.Fragment>
              ))}
              <AddClasses classes={classes} allClasses={allClasses}/>
            </ButtonGroup>

            <Modal show={showLog} onHide={handleClose} data-cy="modal">
              <Modal.Header closeButton>
                <Modal.Title>Enter hours spent to complete this assignment:</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows="2" />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Header>
                <Modal.Title>Enter any comments/feedback about this assignment:</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows="2" />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button data-dy="submit" onClick={() => handleSubmit(logItem)} variant="success">
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

const AddClasses = ({classes, allClasses}) => {
  // when you add a class, the new class list include all previous classes
  // plus the one submitted
  const handleSubmit = (classes, allClasses) => {
    let newClasses = [];
    for (let i = 0; i < classes.classes.length; i += 1) {
        newClasses.push(classes.classes[i])
    }
    for (let i = 0; i < allClasses.allClasses.length; i += 1) {
        if (allClasses.allClasses[i].title === "Data Structures") {
          newClasses.push(allClasses.allClasses[i])
        }
    }
    classes.setClasses(newClasses);
  };
  // when assignment button is clicked, bring up modal and track which class/assignment it is
    return (
      <DropdownButton  className="dropdownButton" title="Add Another Class">
        <Dropdown.Item className="addClassItem btn-primary" onClick={() => handleSubmit(classes, allClasses)}>Data Structures</Dropdown.Item>
      </DropdownButton>
    )
};

// given an assignment JSON, outputs median time for that assignment
const median_time = assignment => {
  const times = assignment.responses.map(response => response.time)
                .sort((a, b) => a - b);
  const mid = _.floor(times.length / 2);
  return _.isEqual(times.length%2, 0) ? _.mean([times[mid-1], times[mid]]) : times[mid];
}

const Recommendations = ({state}) => {
  // the recommendation is to work on the assignment that takes the most time
  let maxHours = 0;
  let cardText = "";
  if (state.classes[0].assignments.length === 0) {
    cardText = "Congrats! You have no more assignments."
  }
  for (let i = 0; i < state.classes.length; i += 1) {
    for (let j = 0; j < state.classes[i].assignments.length; j += 1) {
      let median_time_spent = median_time(state.classes[i].assignments[j]);
      if (median_time_spent > maxHours) {
        maxHours = median_time_spent;
        cardText = "Past students have spent " + median_time_spent + " hours on " + state.classes[i].title + " - " + state.classes[i].assignments[j].title + ". We recommend you start this one first!";
      }
    }
  }
  return (
    <Col>
      <Card border="light">
        <Card.Body>
          <Card.Title><h3>Recommendation</h3></Card.Title>
          <Card.Text>{cardText}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
};

function App() {
  // list of classes with assignments you have yet to complete
  const [classes, setClasses] = useState([{id: "", title: "", assignments: []}])
  const [allClasses, setAllClasses] = useState([{id: "", title: "", assignments: []}])
  const url = '/data/assignments.json';

  useEffect(() => {
    const fetchClasses= async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setAllClasses(json.courses);
      let userCourses = json.users[0].courses;
      setClasses(json.courses.filter(course => userCourses.includes(course.id)));
    }
    fetchClasses();
  }, [])

  return (
    <React.Fragment>
      <Nav/>
      <Container>
      <Row>
          <CurrClasses key={classes.title} classes={{classes, setClasses}} allClasses={{allClasses, setAllClasses}}/>
          <Graph key={classes.title} state={{classes, setClasses}}/>
        </Row>
        <Row>
          <Recommendations state={{classes, setClasses}}/>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default App;
