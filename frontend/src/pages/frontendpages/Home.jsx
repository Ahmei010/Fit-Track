import React from "react";
import HeroSection from "../../components/frontendcomponents/HeroSection";
import WhyChooseUs from "../../components/frontendcomponents/WhyChooseUs";
import WhatWeOffer from "../../components/frontendcomponents/WhatWeOffer";
import RegisterBanner from "../../components/frontendcomponents/RegisterBanner";
import Pricing from "../../components/frontendcomponents/Pricing";
import Membership from "../../components/frontendcomponents/Membership";
import TrainExperts from "../../components/frontendcomponents/TrainExperts";
import GalleryPreview from "../../components/frontendcomponents/GalleryPreview";
import ContactInfo from "../../components/frontendcomponents/ContactInfo";

const Home = () => {
  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <WhatWeOffer />
      <RegisterBanner />
      <Pricing />
      <Membership />
      <TrainExperts />
      <GalleryPreview />
      <ContactInfo />
    </>
  );
};

export default Home;