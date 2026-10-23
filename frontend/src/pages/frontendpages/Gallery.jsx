import galleryBanner from "../../assets/gbanner.jpg";
import card1 from "../../assets/card1.jpg";
import p1 from "../../assets/p1.jpg";
import p2 from "../../assets/p2.jpg";
import p3 from "../../assets/p3.avif";
import p4 from "../../assets/p4.jpeg";
import p5 from "../../assets/p5.jpeg";
import p6 from "../../assets/p6.jpeg";
import p7 from "../../assets/p9.jpeg";

const Gallery = () => {
  const images = [card1, p1, p2, p3, p4, p5, p6, p7];

  return (
    <div className="bg-black text-white min-h-screen w-full overflow-x-hidden animate-fade-in-up">
      <img
        src={galleryBanner}
        alt="Gallery Banner"
        className="w-full aspect-[15/4] object-cover object-[center_35%] block mb-14"
      />

      <div className="text-center mb-14 px-6">
        <p className="text-orange-500 font-semibold mb-2 tracking-widest uppercase">
          Our Gallery
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold">
          Fitness <span className="text-orange-500">Gallery</span>
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Explore fitness, workouts and healthy lifestyle moments.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {images.map((image, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-800"
          >
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
              className="w-full h-[400px] object-cover hover:scale-105 transition duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;