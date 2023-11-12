import { useNavigate } from "react-router";
import AdminHomeCard from "../Admin/AdminHomeCard";
import {
  faWallet,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Waypoint } from "react-waypoint";
import { useSpring, animated } from "react-spring";

function HomeMainOptions() {
  const [ourDoctorsVisible, setOurDoctorsVisible] = useState(false);
  const ourDoctorsSpring = useSpring({
    opacity: ourDoctorsVisible ? 1 : 0,
    transform: ourDoctorsVisible ? "translateX(0)" : "translateX(-50%)",
    config: { duration: 1000 },
  });
  return (
    <div className="d-flex flex-row justify-content-center">
      <Waypoint
        onEnter={() => setOurDoctorsVisible(true)}
        onLeave={() => setOurDoctorsVisible(false)}
      />
      <animated.div style={ourDoctorsSpring} className="d-flex flex-row">
        <div className="mr-2">
          <AdminHomeCard
            location="/patient/health-packages"
            cardText="Health Packages"
            cardDetails="View all health packages"
            icon={faHandHoldingHeart}
          />
        </div>
        <div>
          <AdminHomeCard
            location="/patient/profile"
            cardText="Wallet"
            cardDetails="View my wallet"
            icon={faWallet}
          />
        </div>
      </animated.div>
    </div>
  );
}

export default HomeMainOptions;
