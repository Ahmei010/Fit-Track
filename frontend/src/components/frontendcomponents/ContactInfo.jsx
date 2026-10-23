import React from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const ContactInfo = () => {
  return (
    <section className="bg-[#020617] text-white py-16 border-t border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 text-center">
        <div>
          <FaMapMarkerAlt className="text-orange-500 text-2xl mx-auto mb-3" />
          <h3 className="font-bold">Location</h3>
          <p className="text-gray-400 text-sm">Karachi, Pakistan</p>
        </div>

        <div>
          <FaPhone className="text-orange-500 text-2xl mx-auto mb-3" />
          <h3 className="font-bold">Phone</h3>
          <p className="text-gray-400 text-sm">+92 300 0000000</p>
        </div>

        <div>
          <FaEnvelope className="text-orange-500 text-2xl mx-auto mb-3" />
          <h3 className="font-bold">Email</h3>
          <p className="text-gray-400 text-sm">info@fitness.com</p>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;