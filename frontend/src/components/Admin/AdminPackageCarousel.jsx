import React, {useState} from "react";
import { Button, Carousel } from "react-bootstrap";
import AdminPackageCard from "./AdminPackageCard"; 
import AddNewPackage from "../../forms/AddNewPackage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

export default function AdminPackageCarousel() {

  const packages = [
    { id:'1', name: "Silver Package", dynamic: ["1000LE", "5%", "10%", "20%"] },
    { id:'2', name: "Gold Package", dynamic: ["2000LE", "10%", "15%", "25%"] },
    { id:'3', name: "Platinum Package", dynamic: ["3000LE", "15%", "20%", "30%"] },
  ];

  const [showAddPackage, setShowAddPackage] = useState(false);

    const toggleAddPackage = () => {
        setShowAddPackage(!showAddPackage);
      };

  return (
    <div className="d-flex align-items-center justify-content-center flex-row" style={{width:'100%', marginTop:'20px'}}>
        <Carousel className="d-flex align-items-center carousel-dark" style={{ height: '400px', width: '500px', marginBottom:'5px'}}>
      {packages.map((packagee, index) => (
        <Carousel.Item key={index} className="align-items-center" style={{marginLeft:'21%'}}>
          <AdminPackageCard id ={packagee.id} dynamicTexts={packagee.dynamic} packageName={packagee.name} />
        </Carousel.Item>
      ))}
    </Carousel>
    <div className="d-flex align-items-center justify-content-center flex-column"
    style={{marginLeft:'50px'}}>
    <Button
    style={{ width: "50px", marginBottom: "20px"}}
    id="newAdminForm" onClick={toggleAddPackage}>
    {showAddPackage?<FontAwesomeIcon
              icon={faMinus}
              style={{
                opacity: 1,
                color: "white",
                fontSize: "25px",
                cursor: "pointer",
              }}

            />:<FontAwesomeIcon
            icon={faPlus}
            style={{
              opacity: 1,
              color: "white",
              fontSize: "25px",
              cursor: "pointer",
            }}

          />
      }    
    </Button>
    {showAddPackage && <AddNewPackage/> }
    </div>
    </div>
    
  );
}
