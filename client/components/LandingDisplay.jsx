import React from "react";
import { useNavigate } from "react-router-dom";
import LandingImg from "../media/car-body.gif";

const LandingDisplay = () => {
  // We define a navigate and assign it to the onClick activity
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  return (
    <div className="landing-display">
      <div className="landing-img-div">
        <img className="landing-img" src={LandingImg} alt="landing image" />
      </div>
      <div className="landing-btn-div">
        <button className="landing-btn" onClick={handleClick}>
          {" "}
          Let's Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingDisplay;
