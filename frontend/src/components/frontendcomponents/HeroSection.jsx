import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, ArrowRight, ChevronLeft, ChevronRight, Activity, Flame } from "lucide-react";
import slider1 from "../../assets/banner1.jpeg";
import slider2 from "../../assets/banner2.jpeg";

const slides = [
  {
    image: slider1,
    tag: "POWER & ENDURANCE",
    title: "SHAPE YOUR BODY,",
    highlight: "IGNITE YOUR MIND",
    subtitle:
      "Precision tracking, customized workout schedules, and complete nutritional insights engineered to elevate your daily training.",
  },
  {
    image: slider2,
    tag: "STRENGTH & PERFORMANCE",
    title: "PUSH YOUR LIMITS",
    highlight: "BEYOND BOUNDARIES",
    subtitle:
      "Join thousands of dedicated athletes tracking every rep, meal, and milestone on the ultimate all-in-one fitness platform.",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[640px] sm:h-[680px] lg:h-[720px] overflow-hidden bg-black text-white">
      {/* Background Images with smooth fade */}
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ transitionProperty: "opacity, transform", transitionDuration: "1000ms" }}
        >
          <img
            src={s.image}
            alt="Fitness Hero Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layered dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 tracking-wide">
            <Flame size={16} className="text-orange-500 animate-pulse" />
            <span>{slides[current].tag}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-4 sm:mb-6 text-white uppercase">
            {slides[current].title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
              {slides[current].highlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-normal leading-relaxed mb-6 sm:mb-8 max-w-xl">
            {slides[current].subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to={token ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm sm:text-base transition duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              <Dumbbell size={18} />
              <span>{token ? "Go to Dashboard" : "Start Tracking Now"}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base border border-white/15 hover:border-white/30 backdrop-blur-sm transition duration-300"
            >
              <Activity size={18} className="text-orange-400" />
              <span>Learn More</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-orange-500 text-white border border-white/15 hover:border-orange-500 flex items-center justify-center backdrop-blur-md transition duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-orange-500 text-white border border-white/15 hover:border-orange-500 flex items-center justify-center backdrop-blur-md transition duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current
                ? "w-8 h-2.5 bg-orange-500"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;