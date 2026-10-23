import React from "react";
import { FaDumbbell, FaRunning, FaHeart, FaUsers } from "react-icons/fa";

const WhyChooseUs = () => {
  const items = [
    {
      icon: <FaDumbbell />,
      title: "Modern Equipment",
      text: "Train with quality equipment and comfortable facilities."
    },
    {
      icon: <FaRunning />,
      title: "Daily Exercise",
      text: "Stay active with simple and effective workout routines."
    },
    {
      icon: <FaHeart />,
      title: "Healthy Lifestyle",
      text: "Build better habits and improve your overall lifestyle."
    },
    {
      icon: <FaUsers />,
      title: "Expert Guidance",
      text: "Get proper guidance from experienced fitness trainers."
    }
  ];

  return (
    <section className="bg-[#020617] text-white py-20">
      <div className="text-center mb-12">
        <p className="text-orange-500 font-bold">WHY CHOOSE US</p>
        <h2 className="text-3xl font-bold mt-2">PUSH YOUR LIMITS FORWARD</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
        {items.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-orange-500 text-3xl flex justify-center mb-4">
              {item.icon}
            </div>

            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;