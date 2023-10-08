import React, { useState, useEffect } from "react";
import { Button, Carousel } from "react-bootstrap";
import AdminPackageCard from "./AdminPackageCard";
import AddNewPackage from "../../forms/AddNewPackage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function AdminPackageCarousel() {
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/viewPackagesAdmin");
      if (response.status === 200) {
        setResponseData(response.data);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No packages found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      }
      setLoading(false);
    }
  };
  const packages = responseData;

  const toggleAddPackage = () => {
    setShowAddPackage(!showAddPackage);
  };

  const iconStyle = {
    opacity: 1,
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center flex-row"
      style={{ width: "100%", marginTop: "0px" }}
    >
      <Carousel
        className="d-flex align-items-center carousel-dark"
        style={{ height: "550px", width: "500px", marginBottom: "5px" }}
      >
        {packages.map((packagee, index) => (
          <Carousel.Item
            key={index}
            className="align-items-center"
            style={{ marginLeft: "21%" }}
          >
            <AdminPackageCard
              id={packagee._id}
              packageName={packagee.type}
              fee={packagee.price}
              docDiscount={packagee.sessionDiscount}
              pharmacyDiscount={packagee.medicineDiscount}
              famDiscount={packagee.packageDiscountFM}
            />
          </Carousel.Item>
        ))}
      </Carousel>
      <div
        className="d-flex align-items-center justify-content-center flex-column"
        style={{ marginLeft: "50px" }}
      >
        <Button
          style={{ width: "50px", marginBottom: "20px" }}
          id="newAdminForm"
          onClick={toggleAddPackage}
        >
          {showAddPackage ? (
            <FontAwesomeIcon icon={faMinus} style={iconStyle} />
          ) : (
            <FontAwesomeIcon icon={faPlus} style={iconStyle} />
          )}
        </Button>
        {showAddPackage && <AddNewPackage />}
      </div>
    </div>
  );
}
