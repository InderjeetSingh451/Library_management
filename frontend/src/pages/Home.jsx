import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Book, Wifi, MapPin, Clock, ArrowRight } from "lucide-react";

const Home = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans selection:bg-amber-500/30">
      {/* ================= NAVIGATION ================= */}
      <nav className="fixed top-0 left-0 w-full border-b border-white/5 bg-[#0f1115]/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center font-serif font-bold text-white shadow-lg shadow-amber-600/20">
              B
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white hidden md:block">
              Dr. Bhim Rao Ambedkar Library
            </h1>
            <h1 className="text-lg font-semibold tracking-tight text-white md:hidden">
              Ambedkar Library
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm font-medium hover:text-amber-500 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-amber-900/20 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000"
            className="w-full h-full object-cover"
            alt="Library background"
          />
          {/* Overlays to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1115]/70 via-[#0f1115]/50 to-[#0f1115]"></div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block py-1.5 px-4 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md"
          >
            Premier Learning Space
          </motion.span>

          <motion.h2
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-serif font-medium text-white mb-8 leading-[1.05] tracking-tight"
          >
            Elevate Your Knowledge in <br />
            <span className="italic text-amber-500">Perfect Silence</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            A meticulously curated environment designed for deep work, academic
            research, and the pursuit of excellence.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/signup"
              className="group px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full transition-all flex items-center gap-2 shadow-xl shadow-amber-600/20"
            >
              Start Studying Today <ArrowRight size={20} />
            </Link>

            <div className="flex items-center gap-2 text-white bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-full">
              <MapPin size={18} className="text-amber-500" />
              <span className="text-sm font-medium">Begu Road, Sirsa</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= AMENITIES ================= */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] group hover:border-amber-500/50 transition-all shadow-2xl">
              <div className="w-14 h-14 bg-amber-600/20 rounded-2xl flex items-center justify-center mb-8 text-amber-500">
                <Book size={28} />
              </div>
              <h4 className="text-3xl font-semibold text-white mb-4">
                Expansive Collection
              </h4>
              <p className="text-slate-400 text-lg">
                Access thousands of academic journals and guides in a space
                built for focus.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/[0.08] transition-all">
              <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-8 text-blue-400">
                <Wifi size={28} />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-4">
                High-Speed Wi-Fi
              </h4>
              <p className="text-slate-400">
                Dedicated fiber-optic connection for uninterrupted research.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/[0.08] transition-all">
              <div className="w-14 h-14 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-8 text-emerald-400">
                <Clock size={28} />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-4">
                24/7 Availability
              </h4>
              <p className="text-slate-400">
                Secure access for early birds and night owls alike.
              </p>
            </div>

            <div className="md:col-span-2 bg-gradient-to-tr from-amber-600 to-amber-700 p-10 rounded-[2.5rem] text-white flex flex-col justify-between">
              <h4 className="text-4xl font-serif font-bold italic mb-8">
                "Education is the movement from darkness to light."
              </h4>
              <div className="flex items-center justify-between border-t border-white/20 pt-6">
                <span className="text-lg font-medium">
                  — Inspired by Dr. B.R. Ambedkar
                </span>
                <ArrowRight size={32} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GALLERY (CLEAR IMAGES) ================= */}
      <section className="py-24 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h3 className="text-4xl font-serif text-white mb-2">
                The Environment
              </h3>
              <p className="text-slate-400">
                A look inside our modern facilities.
              </p>
            </div>
            <div className="h-px flex-grow mx-8 bg-white/10 hidden md:block"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
              "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
              "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
              "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
            ].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Library ${index + 1}`}
                className={`rounded-[2rem] h-80 w-full object-cover shadow-2xl border border-white/5 transition-transform duration-500 hover:scale-[1.02] ${index % 2 !== 0 ? "mt-12" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= MAP (UPDATED) ================= */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/5 p-4 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-sm">
            <div className="grid md:grid-cols-3 gap-8 p-8">
              <div className="md:col-span-1 flex flex-col justify-center">
                <h3 className="text-4xl font-serif text-white mb-6">
                  Visit Us
                </h3>
                <p className="text-slate-400 mb-8 text-lg">
                  Located in the heart of Sirsa, easily accessible for all
                  students.
                </p>
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Location</p>
                    <p className="text-slate-400">
                      Near Paper Mill, Begu Road, Sirsa, Haryana
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 rounded-[2rem] overflow-hidden border border-white/10 shadow-inner">
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
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-16 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-slate-500 text-xs tracking-[0.3em] uppercase font-bold mb-8">
            © {new Date().getFullYear()} Dr. Bhim Rao Ambedkar Library
          </p>
          <div className="flex justify-center gap-10 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-amber-500 transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-amber-500 transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-amber-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
