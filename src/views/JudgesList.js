import React, { useState, useEffect, useMemo } from "react";
import { Badge, Input, Button, FormGroup, Label, Table } from "reactstrap";
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

export const initialSeniorJudges = Array.from({ length: 17 }, (_, i) => ({
  name: `Judge ${i + 1}`,
  level: "Senior",
  courtRoom: (i % 17) + 1,
}));

export const initialJuniorJudges = Array.from({ length: 17 }, (_, i) => ({
  name: `Judge ${i + 18}`,
  level: "Junior",
  courtRoom: (i % 17) + 1,
}));

const retireJudge = (retiringJudge, seniorJudges, juniorJudges, vacantJuniorCourtrooms) => {
  if (retiringJudge.level === "Senior") {
    // Remove retiring senior
    const updatedSenior = seniorJudges.filter(j => j.name !== retiringJudge.name);

    if (juniorJudges.length === 0) {
      // No junior to promote - senior slot becomes vacant, but for now senior vacancies not tracked
      return { updatedSeniorJudges: updatedSenior, updatedJuniorJudges: juniorJudges, updatedVacantJuniorCourtrooms: vacantJuniorCourtrooms };
    } else {
      // Promote first junior to senior
      const promotedJunior = { ...juniorJudges[0], level: "Senior", courtRoom: retiringJudge.courtRoom };

      // Remove junior from juniors
      const updatedJunior = juniorJudges.slice(1);

      // The promoted junior’s previous courtroom now vacant for junior
      const vacatedCourtroom = juniorJudges[0].courtRoom;

      const updatedVacantJuniorCourtrooms = [...vacantJuniorCourtrooms, vacatedCourtroom];

      // Add promoted junior to seniors
      const updatedSeniorWithPromotion = [...updatedSenior, promotedJunior];

      return {
        updatedSeniorJudges: updatedSeniorWithPromotion, 
        updatedJuniorJudges: updatedJunior, 
        updatedVacantJuniorCourtrooms: updatedVacantJuniorCourtrooms
      };
    }
  } else if (retiringJudge.level === "Junior") {
    // Remove from junior and free up that courtroom slot
    const updatedJunior = juniorJudges.filter(j => j.name !== retiringJudge.name);
    const updatedVacantJuniorCourtrooms = [...vacantJuniorCourtrooms, retiringJudge.courtRoom];

    return {
      updatedSeniorJudges: seniorJudges,
      updatedJuniorJudges: updatedJunior,
      updatedVacantJuniorCourtrooms,
    };
  }
  return { updatedSeniorJudges: seniorJudges, updatedJuniorJudges: juniorJudges, updatedVacantJuniorCourtrooms: vacantJuniorCourtrooms };
};

export const getCourtroomPairs = (seniorJudges, juniorJudges, vacantJuniorCourtrooms) => {
  return Array.from({ length: 17 }, (_, i) => {
    const courtRoom = i + 1;
    const senior = seniorJudges?.find(j => parseInt(j.courtRoom, 10) === courtRoom);
    const junior = juniorJudges?.find(j => parseInt(j.courtRoom, 10) === courtRoom);
    const isJuniorVacant = vacantJuniorCourtrooms?.includes(courtRoom);
    return { courtRoom, senior, junior, isJuniorVacant };
  });
};

const JudgeRow = ({ courtRoom, senior, junior, onRetire }) => (
  <tr>
    <td>{courtRoom}</td>
    <td>
      {senior ? (
        <>
          <b>{senior.name}</b>{" "}
          <Button size="sm" color="primary" onClick={() => onRetire(senior)}>
            Retire
          </Button>
        </>
      ) : (
        <span className="text-danger">Vacant</span>
      )}
    </td>
    <td>
      {junior ? (
        <>
          <b>{junior.name}</b>{" "}
          <Button  size="sm" color="primary" onClick={() => onRetire(junior)}>
            Retire
          </Button>
        </>
      ) : (
        <span className="text-danger">Vacant</span>
      )}
    </td>
  </tr>
);

const JudgesList = () => {
  const dispatch = useDispatch();
  const [newJudge, setNewJudge] = useState({ name: "", level: "junior", courtRoom: "" });
  const seniorJudges = useSelector(state => state.judges.value.senior); 
  const juniorJudges = useSelector(state => state.judges.value.junior);
  const vacantJuniorCourtrooms = useSelector(state => state.judges.value.vacantJuniorCourtrooms ?? []);
  
  const pairs = useMemo(
    () => getCourtroomPairs(seniorJudges, juniorJudges, vacantJuniorCourtrooms),
    [seniorJudges, juniorJudges, vacantJuniorCourtrooms]
  );
  const handleAddJudge = () => {
    if (vacantJuniorCourtrooms.length === 0) return;
    const assignedCourtRoom = vacantJuniorCourtrooms[0];
    const newJuniorJudge = {
      name: newJudge.name.trim(),
      level: "Junior",
      courtRoom: assignedCourtRoom,
    };
  
    const updatedJuniors = [...juniorJudges, newJuniorJudge];
    const updatedVacantJuniorCourtrooms = vacantJuniorCourtrooms.filter(
      (court) => court !== assignedCourtRoom
    );
    dispatch(setJudges({
      senior: seniorJudges,
      junior: updatedJuniors,
      vacantJuniorCourtrooms: updatedVacantJuniorCourtrooms,
    }));
    setNewJudge({ name: "", level: "Junior", courtRoom: "" });
  };
  
  const handleRetire = (judge) => {
    const { updatedSeniorJudges, updatedJuniorJudges, updatedVacantJuniorCourtrooms } = retireJudge(
      judge,
      seniorJudges,
      juniorJudges,
      vacantJuniorCourtrooms
    );
    setNewJudge({ ...newJudge, courtRoom: updatedVacantJuniorCourtrooms[0] || "" });
    dispatch(setJudges({ senior: updatedSeniorJudges, junior:updatedJuniorJudges, vacantJuniorCourtrooms: updatedVacantJuniorCourtrooms }));
  };

  useEffect(() => {
    if (!seniorJudges?.length || !juniorJudges?.length) {
      dispatch(setJudges({ senior: initialSeniorJudges, junior: initialJuniorJudges, vacantJuniorCourtrooms: [] }));
    }
  }, [dispatch, seniorJudges, juniorJudges, vacantJuniorCourtrooms]);
  return (
    <div>
      <h1>Judges on the Panel</h1>
      <Table bordered>
        <thead>
          <tr>
            <th>Courtroom</th>
            <th>Senior Judge</th>
            <th>Junior Judge</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map(({ courtRoom, senior, junior }) => (
            <JudgeRow
              key={courtRoom}
              courtRoom={courtRoom}
              senior={senior}
              junior={junior}
              onRetire={handleRetire}
            />
          ))}
        </tbody>
      </Table>
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
        <Button 
          color="primary" 
          onClick={handleAddJudge} 
          disabled={!(newJudge.name && vacantJuniorCourtrooms.length > 0)}
        >
          Add Judge
        </Button>
    </div>
  );
};

export default withAuthenticationRequired(JudgesList, {
  onRedirecting: () => <Loading />,
});
