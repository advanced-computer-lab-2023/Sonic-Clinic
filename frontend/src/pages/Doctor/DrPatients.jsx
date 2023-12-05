import React from "react";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import DrHamburgerMenu from "../../components/Doctor/DrHamburgerMenu";
import DrViewPatients from "../../components/Doctor/DrViewPatients";
import ChatPat from "../../components/ChatPat";

function DrPatients() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<DrHamburgerMenu />} />
      <DrViewPatients />
      <ChatPat who="doctor" />
    </div>
  );
}

export default DrPatients;
