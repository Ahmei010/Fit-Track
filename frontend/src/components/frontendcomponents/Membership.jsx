import React from "react";

const Membership = () => {
  const items = [
    "Membership benefits",
    "Flexible workout plans",
    "Professional trainers"
  ];

  return (
    <section className="bg-[#020617] text-white py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-700 p-6">
            <h3 className="font-bold mb-3">{item}</h3>
            <p className="text-gray-400 text-sm">
              Get access to quality fitness facilities and useful workout
              programs.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Membership;