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
// import { judges } from "./JudgesList";
import { useDispatch, useSelector } from "react-redux";
import { setAssignedJudge } from "../store/slices/assignedJudgeSlice";

export const AssignJudge = () => {
  const assignmentDetails = useSelector((state) => state.assignedJudge.value);
  const [casesOpen, setCasesOpen] = useState(false);
  const [benchTypesOpen, setBenchTypesOpen] = useState(false);
  const [numJudgesOpen, setNumJudgesOpen] = useState(false);
  const toggleCasesDropdown = () => setCasesOpen((prevState) => !prevState);
  const toggleBenchTypesDropdown = () =>
    setBenchTypesOpen((prevState) => !prevState);
  const toggleNumJudgesDropdown = () =>
    setNumJudgesOpen((prevState) => !prevState);
  const cases = useSelector((state) => state.cases.value);
  const judges = useSelector((state) => state.judges.value);
  const [benchTypes] = useState([
    "Regular subject matter bench",
    "Constitution bench",
  ]);
  const [numJudgesOptions] = useState([5, 7, 9, 11, 13]);
  const [benchType, setBenchType] = useState(assignmentDetails?.benchType);
  const [selectedCase, setSelectedCase] = useState(assignmentDetails?.case);
  const [numJudges, setNumJudges] = useState(assignmentDetails?.numJudges);
  
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const handleCaseSelect = (item) => {
    setSelectedCase(item);
    setShowToast(false);
  };

  //TODO: based on selected bench type, modify the button text as assign judges or courtrooms
  const handleBenchSelect = (item) => {
    setBenchType(item);
    setShowToast(false);
  };

  const handleNumJudgesSelect = (item) => {
    setNumJudges(item);
    setShowToast(false);
  };

  const assignJudge = () => {
    if (!selectedCase || !benchType) {
      setShowToast(true);
      return;
    }

    let numberOfJudges = 2;
    if (benchType === "Regular subject matter bench") {
      numberOfJudges = 2;
    } else if (benchType === "Constitution bench") {
      numberOfJudges = numJudges;
    }

    if(benchType === "Regular subject matter bench" ) {
      var selectedCourtroom = Math.floor(Math.random() * (17)) + 1;
      dispatch(
        setAssignedJudge({ 
          assignedJudge: selectedCourtroom,
          case: selectedCase,
          benchType: benchType,
          numJudges: numJudges
        })
      );
    }
    else if (benchType === "Constitution bench") {
      const assignedJudges = new Set();
      const seniorJuniorJudges = [... judges.senior, ...judges.junior];
      while (assignedJudges.size < numberOfJudges) {
        const randomJudge =
        seniorJuniorJudges[Math.floor(Math.random() * seniorJuniorJudges.length)].name;
        assignedJudges.add(randomJudge);
      }
      dispatch(
        setAssignedJudge({ 
          assignedJudge: Array.from(assignedJudges).join(", "),
          case: selectedCase,
          benchType: benchType,
          numJudges: numJudges
        })
      );
    }
  };

  return (
    <div className="mb-5">
      <h1>Case Assignment</h1>
      <p className="lead">
        Select your case and the software will allocate courtrooms or judge(s)
        based on certain parameters and a randomizer to ensure a fair process.
      </p>
      <p className="lead">
        If you choose the Regular subject matter bench, the software will assign
        a courtroom to the case. If the Constitution bench is selected, you
        can assign judges and the number of judges on the bench.
      </p>

      <Container>
        <Row className="mt-3">
          <Col>
            <Dropdown isOpen={benchTypesOpen} toggle={toggleBenchTypesDropdown}>
              <DropdownToggle caret>Select bench type</DropdownToggle>
              <DropdownMenu>
                {benchTypes.length > 0 ? (
                  benchTypes.map((item, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => handleBenchSelect(item)}
                    >
                      {item}
                    </DropdownItem>
                  ))
                ) : (
                  <DropdownItem disabled>No data available</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
            <p className="mt-3">Selected Bench type: {benchType}</p>
          </Col>
        </Row>
        {benchType === "Constitution bench" && (
          <Row className="mt-3">
            <Col>
              <Dropdown isOpen={numJudgesOpen} toggle={toggleNumJudgesDropdown}>
                <DropdownToggle caret>
                  Number of judges on the bench
                </DropdownToggle>
                <DropdownMenu>
                  {numJudgesOptions.length > 0 ? (
                    numJudgesOptions.map((item, index) => (
                      <DropdownItem
                        key={index}
                        onClick={() => handleNumJudgesSelect(item)}
                      >
                        {item}
                      </DropdownItem>
                    ))
                  ) : (
                    <DropdownItem disabled>No data available</DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
              <p className="mt-3">Number of Judges: {numJudges}</p>
            </Col>
          </Row>
        )}
        <Row className="mt-5">
          <Col>
            <Dropdown isOpen={casesOpen} toggle={toggleCasesDropdown}>
              <DropdownToggle caret>Select a case</DropdownToggle>
              <DropdownMenu>
                {cases?.length > 0 ? (
                  cases?.map((item, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => handleCaseSelect(item.name)}
                    >
                      {item.name}
                    </DropdownItem>
                  ))
                ) : (
                  <DropdownItem disabled>No data available</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
            <p className="mt-3">Selected Case: {selectedCase}</p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button color="primary" onClick={assignJudge}>
              {benchType === "Regular subject matter bench"
                ? "Assign Courtroom"
                : "Assign Judges"}
            </Button>
            <p className="mt-3">
            {benchType === "Regular subject matter bench"
                ? "Assigned Courtroom: "
                : "Assigned Judges: "} 
              {assignmentDetails?.assignedJudge}</p>
          </Col>
        </Row>
        {showToast && (
          <Row className="mt-3">
            <Col>
              <Toast>
                <ToastHeader>Warning</ToastHeader>
                <ToastBody>
                  Please select a case and bench type before assigning a courtroom.
                </ToastBody>
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
