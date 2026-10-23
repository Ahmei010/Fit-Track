import React from "react";

const Pricing = () => {
  const plans = [
    {
      title: "Class drop-in",
      price: "$39.0",
      text: "SINGLE CLASS"
    },
    {
      title: "12 Month unlimited",
      price: "$99.0",
      text: "SINGLE CLASS"
    },
    {
      title: "6 Month unlimited",
      price: "$59.0",
      text: "SINGLE CLASS"
    }
  ];

  return (
    <section className="bg-[#020617] text-white py-20">
      <div className="text-center mb-12">
        <p className="text-orange-500 font-bold">OUR PLAN</p>
        <h2 className="text-3xl font-bold">CHOOSE YOUR PRICING PLAN</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="border border-gray-700 p-8 text-center"
          >
            <h3 className="font-bold">{plan.title}</h3>
            <h2 className="text-orange-500 text-4xl font-bold my-5">
              {plan.price}
            </h2>
            <p className="text-gray-400">{plan.text}</p>

            <button className="mt-6 bg-orange-500 px-6 py-2">
              JOIN NOW
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;