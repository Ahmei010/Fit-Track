import React from "react";

import blogBanner from "../../assets/bbannner.jpeg";

import workout from "../../assets/p1.jpg";
import fitness from "../../assets/p2.jpg";
import health from "../../assets/p3.avif";
import gym from "../../assets/p4.jpeg";
import yoga from "../../assets/p5.jpeg";
import pushups from "../../assets/p6.jpeg";
import workout2 from "../../assets/p7.jpeg";
import fit from "../../assets/p8.avif";
import jumping_jacks from "../../assets/p9.jpeg";
import pilate from "../../assets/card1.jpg";

const Blogs = () => {
  const blogs = [
    {
      image: workout,
      category: "#Workout",
      title: "Benefits of Daily Exercise",
      date: "September 20, 2026",
    },
    {
      image: fitness,
      category: "#Fitness",
      title: "Stay Consistent",
      date: "September 18, 2026",
    },
    {
      image: health,
      category: "#Health",
      title: "Track Your Progress",
      date: "September 15, 2026",
    },
    {
      image: gym,
      category: "#Workout",
      title: "Build a Better Workout Routine",
      date: "September 12, 2026",
    },
    {
      image: yoga,
      category: "#Health",
      title: "Importance of Good Sleep",
      date: "September 10, 2026",
    },
    {
      image: pushups,
      category: "#Fitness",
      title: "Set Your Fitness Goals",
      date: "September 8, 2026",
    },
    {
      image: workout2,
      category: "#Health",
      title: "Drink More Water",
      date: "September 5, 2026",
    },
    {
      image: fit,
      category: "#Workout",
      title: "Warm Up Before Exercise",
      date: "September 3, 2026",
    },
    {
      image: jumping_jacks,
      category: "#Fitness",
      title: "Make Fitness a Habit",
      date: "September 1, 2026",
    },
    {
      image: pilate,
      category: "#Health",
      title: "Healthy Lifestyle Tips",
      date: "August 28, 2026",
    },
    {
      image: workout,
      category: "#Workout",
      title: "Keep Moving Every Day",
      date: "August 25, 2026",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen pb-20 w-full overflow-x-hidden animate-fade-in-up">
      <section
        className="w-full h-[300px] sm:h-[350px] md:h-[400px] bg-cover bg-center bg-no-repeat mb-14"
        style={{
          backgroundImage: `url(${blogBanner})`,
        }}
      ></section>

      <div className="text-center mb-14 px-6">
        <p className="text-orange-500 font-semibold mb-2">OUR BLOGS</p>

        <h1 className="text-4xl sm:text-5xl font-bold">
          Fitness <span className="text-orange-500">Blogs</span>
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Discover useful fitness tips, workout ideas and healthy lifestyle
          advice to help you stay active and healthy.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
        {blogs.map((blog, index) => (
          <div key={index} className="card-lift group cursor-pointer">
            <div className="overflow-hidden rounded-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            <div className="pt-5">
              <p className="text-gray-400 text-sm mb-3">
                {blog.date}
                <span className="ml-4 text-orange-500">{blog.category}</span>
              </p>

              <h2 className="text-xl font-semibold text-white leading-7">
                {blog.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;