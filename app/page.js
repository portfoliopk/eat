import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <Header />

      {/* HERO SECTION */}
      <section
        className="flex items-center min-h-[80vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/foo.jpg')" }}
      >
        <div className="w-full bg-black/60">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-6">
              Order food to your door
            </h1>

            <p className="text-gray-200 text-lg max-w-xl mb-8">
              Get your favourite meals delivered fast from
              nearby restaurants.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input
                type="text"
                placeholder="Enter your location"
                className="flex-1 px-5 py-3 rounded-md outline-none"
              />

              <button className="bg-[#d70f64] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#bf0d57] transition">
                Find food
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
