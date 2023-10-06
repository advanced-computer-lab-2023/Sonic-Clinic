import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import AdminPackageCard from './AdminPackageCard';

export default function AdminPackageCarousel() {
    //background temporarily black lehad ma ashof aghayar alwan el arrow ezay
    //el hagat mahtota fl carousel but the carousel itself is bayza 
    const packages = [
        { name: "Silver Package", dynamic:["1000LE", "5%", "10%", "20%"]},
        { name: "Gold Package", dynamic:["2000LE", "10%", "15%", "25%"]},
        { name: "Platinum Package", dynamic:["3000LE", "15%", "20%", "30%"]},
      ];
  return (
<Carousel className="d-flex align-items-center" style={{ height: '400px', width: '500px', backgroundColor: 'black' }}>
  {packages.map((packagee, index) => (
    <Carousel.Item key={index} className="d-flex align-items-center justify-content-center">
      <AdminPackageCard dynamicTexts={packagee.dynamic} packageName={packagee.name} />
    </Carousel.Item>
  ))}
</Carousel>


    
  )
}
