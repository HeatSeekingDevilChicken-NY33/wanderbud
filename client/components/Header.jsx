import React from "react";
import Logo from "../Media/Wanderbud.png";

const Header = () => {
  return (
    <div className="header">
      <div className="Logo">
        <img src={Logo} alt="WanderBUD!" />
      </div>
    </div>
  );
};

export default Header;
