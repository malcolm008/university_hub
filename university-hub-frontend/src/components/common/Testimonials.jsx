const testimonials = [
  { name: 'Emily O.', role: 'Computer Science, 2023', text: 'The hands-on projects and mentorship prepared me for my dream job at Google.', img: '👩‍💻' },
  { name: 'James K.', role: 'Business Admin, 2024', text: 'The entrepreneurship center helped me launch my startup while still in school.', img: '🧑‍💼' },
  { name: 'Aisha M.', role: 'Engineering, 2022', text: 'I loved the collaborative environment and the state-of-the-art labs.', img: '👩‍🔬' },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Student Stories</h2>
          <p className="mt-2 text-gray-500">Hear from our alumni about their journey.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 dark:border-zinc-950 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl">{t.img}</div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-purple-400">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-3 text-yellow-400 text-xs">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;