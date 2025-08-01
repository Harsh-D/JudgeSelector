import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, ListGroup, ListGroupItem, ListGroupItemText, Input, Button, FormGroup, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import { addCase } from "../store/slices/caseSlice";
import { subjects } from "./JudgesList";

const CasesList = () => {
  const dispatch = useDispatch();
  const cases = useSelector((state) => state.cases.value);
  const [newCase, setNewCase] = useState({ name: "", categoryCode: "", subCategoryCode: "", subject: "" });
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const toggleSubjectDropdown = () => setSubjectDropdownOpen((prevState) => !prevState);

  const handleAddCase = () => {
    dispatch(addCase(newCase));
    setNewCase({ name: "", categoryCode: "", subCategoryCode: "", subject: "" });
  };

  return (
    <div>
      <h1>Cases</h1>
      <div>
        <FormGroup>
          <Label for="caseName">Case Name</Label>
          <Input
            type="text"
            id="caseName"
            placeholder="Case Name"
            value={newCase.name}
            onChange={(e) => setNewCase({ ...newCase, name: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="caseCategoryCode">Case Category Code</Label>
          <Input
            type="text"
            id="caseCategoryCode"
            placeholder="Case Category Code"
            value={newCase.categoryCode}
            onChange={(e) => setNewCase({ ...newCase, categoryCode: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="caseSubCategoryCode">Case Sub Category Code</Label>
          <Input
            type="text"
            id="caseCategoryCode"
            placeholder="Case Sub Category Code"
            value={newCase.subCategoryCode}
            onChange={(e) => setNewCase({ ...newCase, subCategoryCode: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="caseSubject">Case Subject</Label>
          <Dropdown isOpen={subjectDropdownOpen} toggle={toggleSubjectDropdown}>
            <DropdownToggle caret>
              Select Subject
            </DropdownToggle>
            <DropdownMenu style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => setNewCase({ ...newCase, subject })}
                  >
                    {subject}
                  </DropdownItem>
                ))
              ) : (
                <DropdownItem disabled>No data available</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          <p className="mt-3">Selected Subject: {newCase.subject}</p>
        </FormGroup>
        <Button color="primary" onClick={handleAddCase} disabled={!(newCase.name 
          && newCase.categoryCode 
          && newCase.subCategoryCode
          && newCase.subject)}>Add Case</Button>
      </div>
      <br/>
      <ListGroup>
        {cases?.map((item, index) => (
          <ListGroupItem key={index}>
            <b>Case: </b>
            {item.name}{" "}
            <ListGroupItemText>
              <p>
                <Badge pill color={"dark"} className="text-white">
                  Category Code:
                </Badge>
              </p>
              <p className="text-secondary">{item.categoryCode}</p>
              <p>
                <Badge pill color={"dark"} className="text-white">
                  Sub Category Code:
                </Badge>
              </p>
              <p className="text-secondary">{item.subCategoryCode}</p>
              <p>
                <Badge pill color={"dark"} className="text-white">
                  Subject:
                </Badge>
              </p>
              <p className="text-secondary">{item.subject}</p>
            </ListGroupItemText>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default withAuthenticationRequired(CasesList, {
  onRedirecting: () => <Loading />,
});
