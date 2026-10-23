import React from "react";
import {
  FaDumbbell,
  FaBullseye,
  FaHeartbeat,
  FaTrophy,
} from "react-icons/fa";

import trainer1 from "../../assets/trainer1.jpg";
import trainer2 from "../../assets/trainer2.jpg";
import trainer3 from "../../assets/trainer3.jpg";
import fitnessTraining from "../../assets/Fitness training.jpg";
import testimonial from "../../assets/testimonial.jpg";
import aboutBanner from "../../assets/aboutbanner.jpeg";

const AboutUs = () => {
  const trainers = [
    {
      name: "Ali",
      role: "Fitness Trainer",
      image: trainer1,
    },
    {
      name: "Sara",
      role: "Yoga Trainer",
      image: trainer2,
    },
    {
      name: "Rehman",
      role: "Bodybuilding Coach",
      image: trainer3,
    },
  ];

  return (
    <div className="bg-black text-white w-full overflow-x-hidden animate-fade-in-up">
      <section
        className="w-full h-[300px] sm:h-[350px] md:h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${aboutBanner})`,
        }}
      ></section>

      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-bold">
            WHY CHOOSE US
          </p>

          <h2 className="text-4xl font-bold mt-2">
            PUSH YOUR LIMITS{" "}
            <span className="text-orange-500">FORWARD</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-[#111111] border border-gray-800 p-6 text-center rounded-xl">
            <FaDumbbell className="text-orange-500 text-4xl mx-auto mb-4" />

            <h3 className="text-xl font-bold mb-3">
              Modern Equipment
            </h3>

            <p className="text-gray-400">
              Train with modern equipment designed to support your fitness goals.
            </p>
          </div>

          <div className="bg-[#111111] border border-gray-800 p-6 text-center rounded-xl">
            <FaBullseye className="text-orange-500 text-4xl mx-auto mb-4" />

            <h3 className="text-xl font-bold mb-3">
              Quality Training
            </h3>

            <p className="text-gray-400">
              Get professional guidance and training programs made for you.
            </p>
          </div>

          <div className="bg-[#111111] border border-gray-800 p-6 text-center rounded-xl">
            <FaHeartbeat className="text-orange-500 text-4xl mx-auto mb-4" />

            <h3 className="text-xl font-bold mb-3">
              Professional Trainers
            </h3>

            <p className="text-gray-400">
              Our trainers help you improve your strength, fitness and confidence.
            </p>
          </div>

          <div className="bg-[#111111] border border-gray-800 p-6 text-center rounded-xl">
            <FaTrophy className="text-orange-500 text-4xl mx-auto mb-4" />

            <h3 className="text-xl font-bold mb-3">
              Improve Your Results
            </h3>

            <p className="text-gray-400">
              Stay consistent and work towards achieving your fitness goals.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0b0b0b]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={fitnessTraining}
              alt="Fitness training"
              className="w-full h-[500px] object-cover rounded-xl"
            />
          </div>

          <div>
            <p className="text-orange-500 font-bold">
              ABOUT US
            </p>

            <h2 className="text-4xl font-bold mt-2 mb-5">
              WHAT WE{" "}
              <span className="text-orange-500">
                HAVE DONE
              </span>
            </h2>

            <p className="text-gray-400 leading-7 mb-5">
              Fitness-Tracker is a modern fitness platform created to help
              people stay active, motivated and focused on their fitness goals.
            </p>

            <p className="text-gray-400 leading-7">
              We provide useful fitness information, workout guidance and
              resources to make your fitness journey easier and more enjoyable.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-bold">
            OUR TEAM
          </p>

          <h2 className="text-4xl font-bold mt-2">
            TRAIN WITH{" "}
            <span className="text-orange-500">
              EXPERTS
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden"
            >
              <div className="w-full h-[380px] sm:h-[460px] md:h-[520px] lg:h-[600px] overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="p-5 text-center">
                <h3 className="text-2xl font-bold">
                  {trainer.name}
                </h3>

                <p className="text-orange-500 mt-2">
                  {trainer.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-black/70 py-16 px-6 text-center">
          <p className="text-orange-500 font-bold">
            JOIN US TODAY
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            REGISTRATION NOW TO GET MORE DEALS
          </h2>

          <p className="text-gray-300 mt-4">
            Start your fitness journey and become a stronger version of yourself.
          </p>

          <button
            className="
              mt-7
              border
              border-orange-500
              text-orange-500
              px-8
              py-3
              font-bold
              hover:bg-orange-500
              hover:text-black
              transition
            "
          >
            APPOINTMENT
          </button>
        </div>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <p className="text-orange-500 font-bold">
          TESTIMONIAL
        </p>

        <h2 className="text-4xl font-bold mt-2 mb-8">
          OUR CLIENT{" "}
          <span className="text-orange-500">
            SAY
          </span>
        </h2>

        <div className="bg-[#111111] border border-gray-800 rounded-xl p-8">
          <div className="w-[250px] h-[250px] rounded-full overflow-hidden mx-auto mb-5">
            <img
              src={testimonial}
              alt="Client"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-gray-400 leading-7">
            Fitness-Tracker helped me stay consistent with my workouts.
            The training guidance and positive environment keep me motivated.
          </p>

          <h3 className="text-xl font-bold mt-5">
            Alina
          </h3>

          <p className="text-orange-500">
            Fitness Member
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;