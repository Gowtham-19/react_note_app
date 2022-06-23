import React from "react";
import { Container } from "reactstrap";

const Footer = () => {
  return (
    <Container fluid 
    tag="footer"
    className="footer-color fixed-bottom p-1"
   >
      <b  onClick={() => {
      window.open("https://github.com/Gowtham-19")
    }}>copyright@Gowtham-19.github.com</b>
    </Container>
    
  );
};

export default Footer
