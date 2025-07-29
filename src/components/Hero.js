import React from "react";

const Hero = () => (
  <div className="text-center hero my-5">
    <h1 className="mb-4">Judge Selector</h1>
    <p className="lead">
      This is a beta version of the application to ensure a fair and just
      allocation of the cases using computer algorithm.
      <br/>
      <p>
        <b>Upcoming features:</b>
        <ul>
          <li>Roaster creation</li>
          <li>Pair creation</li>
          <li>Bench Continuity Rule</li>
          <li>Promotion Rule (Post-Retirement)</li>
          <li>Recusal from case</li>
        </ul>
      </p>
      <i>Please note that currently the computed results will not be persisted once you close the application or the session.</i>
    </p>
  </div>
);

export default Hero;
