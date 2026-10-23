
import React, { useState } from "react";
import contactBanner from "../../assets/contactbanner.jpeg";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageSent(true);
    e.target.reset();
  };

  return (
    <>
      <div className="bg-black text-white min-h-screen">
        <img
          src={contactBanner}
          alt="Contact Banner"
          className="w-full aspect-[15/4] object-cover object-[center_35%] block mb-14"
        />

        <div className="text-center mb-14 px-6">
          <p className="text-orange-500 font-semibold mb-2 tracking-widest uppercase">
            Get In Touch
          </p>

          <h1 className="text-5xl font-bold">
            Contact <span className="text-orange-500">Us</span>
          </h1>

          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            We are here to help you. Feel free to contact us anytime.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Let's <span className="text-orange-500">Talk</span>
              </h2>

              <p className="text-gray-400 leading-7">
                Have a question, suggestion or need help?
                Send us a message and our team will get back to you
                as soon as possible.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black">
                  <FaEnvelope />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="font-semibold">info@fittrack.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black">
                  <FaPhone />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="font-semibold">+92 300 1234567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="font-semibold">Karachi, Pakistan</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">
                Find <span className="text-orange-500">Us</span>
              </h3>

              <div className="w-full h-[260px] rounded-xl overflow-hidden border border-gray-800">
                <iframe
                  src="https://www.google.com/maps?q=Aptech+Learning+Shahrah+e+Faisal+Center+Karachi&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="FitTrack Location"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-3xl font-bold mb-2">
              Send Us A <span className="text-orange-500">Message</span>
            </h2>

            <p className="text-gray-400 mb-7">
              Fill out the form below and we will get back to you.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block mb-2 text-sm text-gray-300">
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="w-full bg-black text-white border border-gray-700 p-3 rounded-lg outline-none focus:border-orange-500"
                />
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm text-gray-300">
                  Your Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full bg-black text-white border border-gray-700 p-3 rounded-lg outline-none focus:border-orange-500"
                />
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm text-gray-300">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Enter subject"
                  required
                  className="w-full bg-black text-white border border-gray-700 p-3 rounded-lg outline-none focus:border-orange-500"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm text-gray-300">
                  Your Message
                </label>

                <textarea
                  placeholder="Write your message..."
                  rows="5"
                  required
                  className="w-full bg-black text-white border border-gray-700 p-3 rounded-lg outline-none focus:border-orange-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-black font-bold py-3 rounded-lg hover:bg-orange-600 transition"
              >
                Send Message
              </button>

              {messageSent && (
                <p
                  role="status"
                  className="mt-4 text-center text-green-500 font-semibold"
                >
                  Message has been sent successfully!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
