import Carousel from "react-bootstrap/Carousel";
import React, { useState, useEffect } from "react";
import doctor from "../../Assets/Patient/Doctor.jpg";
import doctorLaptop from "../../Assets/Guest/doctorLaptop.jpg";
import family from "../../Assets/Guest/family.jpg";
import hands from "../../Assets/Guest/hands.jpg";
import { Card, Image } from "react-bootstrap";

const RegPhoto = () => {
  const carouselData = [
    {
      id: 1,
      src: family,
      alt: "First Slide",
    },
    {
      id: 2,
      src: doctorLaptop,
      alt: "Second Slide",
    },
    {
      id: 3,
      src: hands,
      alt: "Third Slide",
    },
  ];
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < 2) {
        setIndex(index + 1);
      } else {
        setIndex(0);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [index]);

  return (
    <div className="col-11">
      <style>
        {`
          .carousel-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        interval={5000}
        controls={false}
      >
        {carouselData.map((item) => (
          <Carousel.Item key={item.id}>
            <Card style={{ height: "580px" }}>
              <div style={{ overflow: "hidden", height: "100%" }}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default RegPhoto;
