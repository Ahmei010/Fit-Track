import React from "react";
import gallery1 from "../../assets/p6.jpeg";
import gallery2 from "../../assets/p5.jpeg";
import gallery3 from "../../assets/p4.jpeg";
import gallery4 from "../../assets/gallery2.jpg";
import gallery5 from "../../assets/gallery3.jpg";
import gallery6 from "../../assets/gallery6.jpg";

const GalleryPreview = () => {
  const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

  return (
    <section className="bg-[#020617] text-white py-20">
      <div className="text-center mb-10">
        <p className="text-orange-500 font-bold">OUR GALLERY</p>
        <h2 className="text-3xl font-bold">FITNESS MOMENTS</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto px-6">
        {images.map((image, index) => (
          <div key={index} className="overflow-hidden aspect-[4/3]">
            <img
              src={image}
              alt={`Gym ${index + 1}`}
              className="w-full h-full object-cover object-top"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryPreview;