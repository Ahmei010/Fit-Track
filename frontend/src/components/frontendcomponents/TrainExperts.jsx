import React from "react";
import trainer1 from "../../assets/expert1.jpg";
import trainer2 from "../../assets/expert2.jpg";
import trainer3 from "../../assets/expert3.jpg";

const TrainExperts = () => {
  const trainers = [trainer1, trainer2, trainer3];

  return (
    <section className="bg-[#020617] text-white py-20">
      <div className="text-center mb-12">
        <p className="text-orange-500 font-bold">OUR TEAM</p>
        <h2 className="text-3xl font-bold">TRAIN WITH EXPERTS</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
        {trainers.map((image, index) => (
          <div key={index} className="h-72 overflow-hidden">
            <img
              src={image}
              alt="Trainer"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrainExperts;