import { useNavigate } from "react-router";
import AdminHomeCard from "../Admin/AdminHomeCard";
import {
  faWallet,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function HomeMainOptions() {
  return (
    <div className="d-flex flex-row justify-content-center">
      <AdminHomeCard
        location="/patient/health-packages"
        cardText="Health Packages"
        cardDetails="View all health packages"
        icon={faHandHoldingHeart}
      />
      <AdminHomeCard
        location="/patient/profile"
        cardText="Wallet"
        cardDetails="View my wallet"
        icon={faWallet}
      />
    </div>
  );
}

export default HomeMainOptions;
