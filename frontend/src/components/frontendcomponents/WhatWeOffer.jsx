import React from "react";
import offer1 from "../../assets/p11.jpg";
import offer2 from "../../assets/p12.jpg";
import offer3 from "../../assets/p13.jpg";

const WhatWeOffer = () => {
  return (
    <section className="bg-[#020617] text-white py-20">
      <div className="text-center mb-12">
        <p className="text-orange-500 font-bold">OUR CLASSES</p>
        <h2 className="text-3xl font-bold">WHAT WE CAN OFFER</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
        <div className="relative h-80 overflow-hidden">
          <img
            src={offer1}
            alt="Indoor Cycling"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/50 flex items-end">
            <h3 className="text-xl font-bold p-6">Indoor Cycling</h3>
          </div>
        </div>

        <div className="relative h-80 overflow-hidden">
          <img
            src={offer2}
            alt="Boxing"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/50 flex items-end">
            <h3 className="text-xl font-bold p-6">Boxing</h3>
          </div>
        </div>

        <div className="relative h-80 overflow-hidden">
          <img
            src={offer3}
            alt="Personal Training"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/50 flex items-end">
            <h3 className="text-xl font-bold p-6">Personal Training</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;