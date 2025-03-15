import React, { useState, useEffect } from "react";
import { Badge, ListGroup, ListGroupItem, ListGroupItemText, Input, Button, FormGroup, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setJudges } from "../store/slices/judgesSlice";

export const subjects = [
  "Direct Tax Matters",
  "Indirect Tax Matters",
  "Service Matters",
  "Letter Petitions & PIL Matters & Social Justice Matters",
  "Election Matters",
  "Company Law, MRTP, TRAI, SEBI, IDRAI & RBI Matters",
  "Arbitration Matters",
  "Habeas Corpus Matters",
  "Criminal Matters",
  "Appeals Against Orders of Statutory Bodies",
  "Contempt of Court Matters",
  "Appointment of Constitutional Functionaries",
  "Statutory Appointments & Law Officers",
  "Personal Law Matters",
  "Mercantile Laws & Commercial Transactions",
  "Judicial Officers Matters",
  "Admission to Educational Institutions (Non-Medical & Engineering)",
  "Mines, Minerals & Mining Leases",
  "Admiralty & Maritime Law Matters",
  "Commissions of Enquiry Matters",
  "Armed Forces & Paramilitary Forces Matters",
  "Admission/Transfer to Engineering & Medical Colleges",
  "Leases, Govt. Contracts & Contracts by Local Bodies",
  "State Excise, Liquor Trading, Licenses, Distilleries & Breweries",
  "Labour Matters",
  "Land Acquisition & Requisition Matters",
  "Academic Matters",
  "Rent Act Matters",
  "Compensation Matters",
  "Family Law Matters",
  "Ordinary Civil Matters",
  "Simple Money & Mortgage Matters",
  "Eviction under Public Premises (Eviction) Act",
  "Consumer Protection Matters",
  "Religious & Charitable Endowment Matters",
  "Establishment & Recognition of Educational Institutions",
];

const getRandomSubjects = () => {
  const shuffled = subjects.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 2).join(", ");
};

//TODO: move the default logic to a separate file or slice file
export const initialJudges = Array.from({ length: 34 }, (_, i) => ({
  name: `Judge ${i + 1}`,
  expertise: `${getRandomSubjects()}`,
  level: i < 16 ? "Senior" : "Junior",
  courtRoom: (i % 17) + 1,
}));

const JudgesList = () => {
  const dispatch = useDispatch();
  const judgeList = useSelector((state) => state.judges.value);
  const [newJudge, setNewJudge] = useState({ name: "", expertise: [], level: "", courtRoom: "" });
  const [expertiseDropdownOpen, setExpertiseDropdownOpen] = useState(false);
  const toggleExpertiseDropdown = () => setExpertiseDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    if (judgeList.length === 0) {
      dispatch(setJudges(initialJudges));
    }
  }, [dispatch, judgeList.length]);

  const handleAddJudge = () => {
    const updatedJudges = [...judgeList, { ...newJudge, expertise: newJudge.expertise.join(", ") }];
    dispatch(setJudges(updatedJudges));
    setNewJudge({ name: "", expertise: [], level: "", courtRoom: "" });
  };

  const handleExpertiseSelect = (subject) => {
    setNewJudge((prevState) => ({
      ...prevState,
      expertise: prevState.expertise.includes(subject)
        ? prevState.expertise.filter((item) => item !== subject)
        : [...prevState.expertise, subject],
    }));
  };

  return (
    <div>
      <h1>Judges on the panel</h1>
      <div>
        <FormGroup>
          <Label for="judgeName">Judge Name</Label>
          <Input
            type="text"
            id="judgeName"
            placeholder="Judge Name"
            value={newJudge.name}
            onChange={(e) => setNewJudge({ ...newJudge, name: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="judgeExpertise">Judge Expertise</Label>
          <Dropdown isOpen={expertiseDropdownOpen} toggle={toggleExpertiseDropdown}>
            <DropdownToggle caret>
              Select Expertise
            </DropdownToggle>
            <DropdownMenu style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => handleExpertiseSelect(subject)}
                    active={newJudge.expertise.includes(subject)}
                  >
                    {subject}
                  </DropdownItem>
                ))
              ) : (
                <DropdownItem disabled>No data available</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          <p className="mt-3">Selected Expertise: {newJudge.expertise.join(", ")}</p>
        </FormGroup>
        <FormGroup tag="fieldset">
          <Label>Judge Level</Label>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="judgeLevel"
                value="Senior"
                checked={newJudge.level === "Senior"}
                onChange={(e) => setNewJudge({ ...newJudge, level: e.target.value })}
              />
              Senior
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="judgeLevel"
                value="Junior"
                checked={newJudge.level === "Junior"}
                onChange={(e) => setNewJudge({ ...newJudge, level: e.target.value })}
              />
              Junior
            </Label>
          </FormGroup>
        </FormGroup>
        <FormGroup>
          <Label for="courtRoom">Court Room</Label>
          <Input
            type="number"
            id="courtRoom"
            placeholder="Court Room"
            value={newJudge.courtRoom}
            onChange={(e) => setNewJudge({ ...newJudge, courtRoom: e.target.value })}
          />
        </FormGroup>
        <Button color="primary" onClick={handleAddJudge} disabled={!(newJudge.name && newJudge.expertise.length > 0 && newJudge.level && newJudge.courtRoom)}>Add Judge</Button>
      </div>
      <br/>
      <ListGroup>
        {judgeList.map((item, index) => (
          <ListGroupItem key={index}>
            <b>Name: </b>
            {item.name}{" "}
            <ListGroupItemText>
              <Badge
                pill
                color={item.level === "Senior" ? "dark" : "secondary"}
                className="text-white"
              >
                {item.level}
              </Badge>
              <p>
                <Badge pill color={"dark"} className="text-white">
                  Expertise:
                </Badge>
              </p>
              <p className="text-secondary">{item.expertise}</p>
              <Badge pill color={"dark"} className="text-white">
                Court Room:
              </Badge>
              <p className="text-secondary">{item.courtRoom}</p>
            </ListGroupItemText>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default withAuthenticationRequired(JudgesList, {
  onRedirecting: () => <Loading />,
});
