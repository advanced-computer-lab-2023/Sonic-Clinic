import React, {useState} from "react";
import { Button, Carousel } from "react-bootstrap";
import AdminPackageCard from "./AdminPackageCard"; 
import AddNewPackage from "../../forms/AddNewPackage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

export default function AdminPackageCarousel() {

  const packages = [
    { id:'1', name: "Silver Package", annualFee: "1000LE", docDis: "10%", pharmDis:"10%", famDis:"10%"},
    { id:'2', name: "Gold Package", annualFee: "3000LE", docDis: "20%", pharmDis:"20%", famDis:"20%"},
    { id:'3', name: "Platinum Package", annualFee: "7000LE", docDis: "30%", pharmDis:"30%", famDis:"30%"},
  ];

  const [showAddPackage, setShowAddPackage] = useState(false);

    const toggleAddPackage = () => {
        setShowAddPackage(!showAddPackage);
      };

      const iconStyle={
        opacity: 1,
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
      }
        
      

  return (
    <div className="d-flex align-items-center justify-content-center flex-row" style={{width:'100%', marginTop:'0px'}}>
        <Carousel className="d-flex align-items-center carousel-dark" style={{ height: '550px', width: '500px', marginBottom:'5px'}}>
      {packages.map((packagee, index) => (
        <Carousel.Item key={index} className="align-items-center" style={{marginLeft:'21%'}}>
          <AdminPackageCard id ={packagee.id} packageName={packagee.name} fee={packagee.annualFee} docDiscount={packagee.docDis} pharmacyDiscount={packagee.pharmDis} famDiscount={packagee.famDis} />
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
              style={iconStyle}

            />:<FontAwesomeIcon
            icon={faPlus}
            style={iconStyle}

          />
      }    
    </Button>
    {showAddPackage && <AddNewPackage/> }
    </div>
    </div>
    
  );
}
