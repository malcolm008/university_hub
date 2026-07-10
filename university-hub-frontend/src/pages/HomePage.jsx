import Hero from '../components/common/Hero';
import Testimonials from '../components/common/Testimonials';
import MediaGallery from '../components/common/MediaGallery';
import CTASection from '../components/common/CTASection';

const HomePage = ({ setCurrentPage }) => {
  return (
    <>
      <Hero setCurrentPage={setCurrentPage} />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our University?</h2>
            <p className="mt-3 text-gray-500">Experience excellence in education, research, and campus life.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'fa-graduation-cap', title: 'Top-Tier Education', desc: 'World-class programs taught by industry experts.' },
              { icon: 'fa-users', title: 'Vibrant Campus Life', desc: 'Join a diverse community of 12,000+ students.' },
              { icon: 'fa-flask', title: 'Cutting-Edge Research', desc: 'State-of-the-art labs and research opportunities.' },
              { icon: 'fa-globe', title: 'Global Network', desc: 'Alumni working at Fortune 500 companies worldwide.' },
            ].map((f, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl card-hover border dark:border-zinc-950 border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl mb-4">
                  <i className={`fas ${f.icon}`}></i>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-purple-400">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <MediaGallery />
      <Testimonials />
      <CTASection setCurrentPage={setCurrentPage} />
    </>
  );
};

export default HomePage;