import React from "react";
import registerBg from "../../assets/register.jpg";
import { Link } from "react-router-dom";

const RegisterBanner = () => {
  return (
    <section
      className="bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${registerBg})`,
        backgroundPosition: "center 30%",
      }}
    >
      <div className="bg-black/60 min-h-[420px] flex flex-col items-center justify-center text-center text-white px-6">
        <p className="text-orange-500 font-bold">REGISTRATION NOW</p>

        <h2 className="text-3xl md:text-4xl font-bold mt-3">
          GET MORE DEALS
        </h2>

          
<Link
  to="/register"
  className="mt-6 inline-block bg-orange-500 px-8 py-3 font-bold text-white"
>
  REGISTER NOW
</Link>

      </div>
    </section>
  );
};

export default RegisterBanner;