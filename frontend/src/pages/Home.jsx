import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f5f1eb] text-gray-800">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur shadow z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#4b2e2e]">
            Dr. Bhim Rao Ambedkar Library
          </h1>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2 border border-[#4b2e2e] text-[#4b2e2e] rounded-full hover:bg-[#4b2e2e] hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-[#4b2e2e] text-white rounded-full hover:opacity-90 transition"
            >
              Signup
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section
        className="pt-36 pb-28 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1507842217343-583bb7270b66)",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            A Peaceful Place <br /> For Serious Study
          </h2>

          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            A calm and disciplined environment with comfortable seating, quality
            books, and essential facilities for focused learning.
          </p>

          <p className="mt-4 text-sm md:text-base text-gray-200 tracking-wide">
            📍 Near Paper Mill, Begu Road, Sirsa
          </p>
        </div>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6">
          {[
            { title: "Quiet Sitting Area", icon: "🪑" },
            { title: "Quality Books", icon: "📚" },
            { title: "Free Wi-Fi", icon: "📶" },
            { title: "Drinking Water", icon: "🚰" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="font-semibold text-lg text-[#4b2e2e]">
                {item.title}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da"
            alt="Study area"
            className="rounded-2xl shadow-lg"
          />

          <div>
            <h3 className="text-3xl font-bold mb-4 text-[#4b2e2e]">
              About the Library
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Dr. Bhim Rao Ambedkar Library is designed for students who value
              discipline, silence, and consistency in their studies. We focus on
              providing a clean and peaceful physical space for learning.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Inspired by the values of Dr. B. R. Ambedkar, our library promotes
              education, equality, and self-growth through knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#4b2e2e]">
            Library Environment
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
              "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
              "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
            ].map((src) => (
              <img
                key={src}
                src={src}
                alt="Library"
                className="rounded-xl shadow hover:scale-105 transition"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= LIVE MAP LOCATION ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-4 text-[#4b2e2e]">
            Find Us on Map
          </h3>

          <p className="text-center text-gray-600 mb-10">
            📍 Near Paper Mill, Begu Road, Sirsa
          </p>

          <div className="rounded-2xl overflow-hidden shadow-lg border">
            <iframe
              title="Dr. Bhim Rao Ambedkar Library Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1650.0680760156129!2d75.0320641374515!3d29.518572600000013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39114db915591c39%3A0x627dee8c901c7156!2z4KSh4KWJLiDgpIXgpK7gpY3gpKzgpYfgpKHgpJXgpLAg4KSq4KWB4KS44KWN4KSk4KSV4KS-4KSy4KSv!5e1!3m2!1sen!2sin!4v1771440843420!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-[#4b2e2e] text-white text-center">
        <h3 className="text-3xl font-bold mb-4">
          Join a Serious Study Environment
        </h3>
        <p className="mb-6 opacity-90">
          Login or Signup to access library management features.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-white text-[#4b2e2e] rounded-full font-semibold"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2 bg-[#6b8e23] rounded-full font-semibold"
          >
            Signup
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 bg-[#2f1d1d] text-gray-300 text-center">
        © {new Date().getFullYear()} Dr. Bhim Rao Ambedkar Library. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Home;
