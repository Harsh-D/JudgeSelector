import React from "react";
import { ListGroup, ListGroupItem, ListGroupItemText } from "reactstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";

export const judges = [
  {name: "Judge 1", details: "Expertise: Topic A,B,C."},
  {name: "Judge 2", details: "Expertise: Topic D,E,F."},
  {name: "Judge 3", details: "Expertise: Topic G,H,I."},
  {name: "Judge 4", details: "Expertise: Topic D,E,F."},
  {name: "Judge 5", details: "Expertise: Topic G,H,I."},
  {name: "Judge 6", details: "Expertise: Topic A,B,C."},
  {name: "Judge 7", details: "Expertise: Topic D,E,F."},
  {name: "Judge 8", details: "Expertise: Topic G,H,I."},
  {name: "Judge 9", details: "Expertise: Topic P,Q,R."},
  {name: "Judge 10", details: "Expertise: Topic S,T,U."},
];

const JudgesList = () => {
  return (
    <div>
      <h1>Judges on the panel</h1>
      <ListGroup>
        {judges.map((item, index) => (
          <ListGroupItem key={index}>
            {item.name}
            <ListGroupItemText>
            {item.details}
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
