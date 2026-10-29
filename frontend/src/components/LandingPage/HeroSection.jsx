import { Calendar, Users, Coffee } from "lucide-react";
import heroImage from "../../assets/hero-coffee.jpg";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 ">
        <img
          src={heroImage}
          alt="Coffee Shop Interior"
         className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />
      </div>
    

      {/* Content */}
      <div className="relative z-10 container mx-auto p-20">
        <div className="max-w-2xl m-4 space-y-6">
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            Modern Dining,
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Perfect Timing
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-white/80 max-w-xl">
            Where Great Flavors Meet Smart Service!
          </p>

          <p className="text-white/70 max-w-lg">
            Reserve your table, explore our menu, and enjoy a seamless dining
            experience with online ordering and payment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-md shadow hover:opacity-90 transition">
              <Calendar size={20} />
              Book a Table
            </button>

            <button className="border border-yellow-500 text-yellow-500 px-6 py-3 rounded-md hover:bg-yellow-500 hover:text-white transition">
              View Menu
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10 pt-6">
            {/* Menu Items */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Coffee size={24} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-white/60 text-sm">Menu Items</p>
              </div>
            </div>

            {/* Happy Customers */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Users size={24} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">2000+</p>
                <p className="text-white/60 text-sm">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
