import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Toast,
  ToastBody,
  ToastHeader,
} from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import { judges } from "./JudgesList";

export const AssignJudge = () => {
  const [casesOpen, setCasesOpen] = useState(false);
  const [benchTypesOpen, setBenchTypesOpen] = useState(false);
  const toggleCasesDropdown = () => setCasesOpen((prevState) => !prevState);
  const toggleBenchTypesDropdown = () => setBenchTypesOpen((prevState) => !prevState); 
  const [cases] = useState([
    "Case 1",
    "Case 2",
    "Case 3",
    "Case 4",
    "Case 5",
  ]);
  const [benchTypes] = useState(["Regular subject matter bench", "Constitution Bench"]); 
  const [benchType, setBenchType] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [assignedJudge, setAssignedJudge] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleCaseSelect = (item) => {
    setSelectedCase(item);
    setShowToast(false);
  };

  const handleBenchSelect = (item) => {
    setBenchType(item);
    setShowToast(false);
  };

  const assignJudge = () => {
    if (!selectedCase || !benchType) {
      setShowToast(true);
      return;
    }

    let numberOfJudges = 1;
    if (benchType === "Regular subject matter bench") {
      numberOfJudges = 2;
    } else if (benchType === "Constitution Bench") {
      numberOfJudges = 5;
    }

    const assignedJudges = new Set();
    while (assignedJudges.size < numberOfJudges) {
      const randomJudge = judges[Math.floor(Math.random() * judges.length)].name;
      assignedJudges.add(randomJudge);
    }
    setAssignedJudge(Array.from(assignedJudges).join(", "));
  };

  return (
    <div className="mb-5">
      <h1>Assign a Judge</h1>
      <p className="lead">
        Select your case and the software will allocate a judge based on certain
        parameters and a randomizer to ensure a fair process.
      </p>

      <Container>
        <Row className="mt-5">
          <Col>
            <Dropdown isOpen={casesOpen} toggle={toggleCasesDropdown}>
              <DropdownToggle caret>Select a case</DropdownToggle>
              <DropdownMenu>
                {cases.map((item, index) => (
                  <DropdownItem key={index} onClick={() => handleCaseSelect(item)}>
                    {item}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <p className="mt-3">Selected Case: {selectedCase}</p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Dropdown isOpen={benchTypesOpen} toggle={toggleBenchTypesDropdown}>
              <DropdownToggle caret>Select bench type</DropdownToggle>
              <DropdownMenu>
                {benchTypes.map((item, index) => (
                  <DropdownItem key={index} onClick={() => handleBenchSelect(item)}>
                    {item}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <p className="mt-3">Selected Bench type: {benchType}</p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button color="primary" onClick={assignJudge} >
              Assign Judge
            </Button>
            <p className="mt-3">Assigned Judge(s): {assignedJudge}</p>
          </Col>
        </Row>
        {showToast && (
          <Row className="mt-3">
            <Col>
              <Toast>
                <ToastHeader>
                  Warning
                </ToastHeader>
                <ToastBody>Please select a case and bench type before assigning a judge.</ToastBody>
              </Toast>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default withAuthenticationRequired(AssignJudge, {
  onRedirecting: () => <Loading />,
});
