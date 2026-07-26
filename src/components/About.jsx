import { motion } from "framer-motion";
import aboutData from "../data/aboutData";

const About = () => {
  return (
    <section id="about" className="py-24 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-14"
        >
          {aboutData.title}
        </motion.h2>
        <p className="text-gray-400 text-center mt-4 mb-12 max-w-2xl mx-auto text-lg">
            {aboutData.subtitle}
        </p>

        {/* Highlight Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">

          {aboutData.highlights.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{item.emoji}</div>

              <h3 className="font-semibold text-lg">
                {item.title}
              </h3>

              <p className="text-gray-400 mt-2 text-sm">
                 {item.value}
              </p>

              <p className="text-blue-400 text-sm mt-1">
                    {item.company}
              </p>

            </motion.div>
          ))}

        </div>

        {/* Journey */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 p-10"
        >

          <h3 className="text-2xl font-semibold mb-6 text-blue-400">
            My Journey
          </h3>

          <p className="text-gray-300 leading-9 whitespace-pre-line max-w-3xl">
            {aboutData.journey}
          </p>

        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {aboutData.stats.map((item) => (
            <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >
            <h3 className="text-4xl font-bold text-blue-400">
                {item.number}
            </h3>

            <p className="text-gray-400 mt-3">
                {item.label}
            </p>
            </motion.div>
        ))}
        </div>

      </div>
    </section>
  );
};

export default About;