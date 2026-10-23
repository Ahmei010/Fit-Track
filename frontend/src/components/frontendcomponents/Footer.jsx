import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaFacebookF
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#020617] text-white py-10">

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-2xl font-bold">
            Fitness<span className="text-orange-500">-Tracker</span>
          </h2>

          <p className="text-gray-400 mt-4">
            Your fitness journey starts here. Stay active, stay healthy.
          </p>

          <div className="flex gap-4 mt-6">

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-black transition"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-black transition"
            >
              <FaTwitter />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-black transition"
            >
              <FaYoutube />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-black transition"
            >
              <FaFacebookF />
            </a>

          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>

          <div className="flex flex-col gap-2">
            <Link to="/home" className="text-gray-400 hover:text-orange-500">
              Home
            </Link>

            <Link to="/about" className="text-gray-400 hover:text-orange-500">
              About Us
            </Link>

            <Link to="/blog" className="text-gray-400 hover:text-orange-500">
              Blog
            </Link>

            <Link to="/gallery" className="text-gray-400 hover:text-orange-500">
              Gallery
            </Link>

            <Link to="/contact" className="text-gray-400 hover:text-orange-500">
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Contact</h3>

          <p className="text-gray-400 mb-2">
            Email: info@fittrack.com
          </p>

          <p className="text-gray-400 mb-2">
            Phone: +92 300 1234567
          </p>

          <p className="text-gray-400">
            Karachi, Pakistan
          </p>
        </div>

      </div>

      <div className="border-t border-gray-800 mt-8 pt-5 text-center text-gray-500">
        © 2026 Fitness-Tracker. All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;
