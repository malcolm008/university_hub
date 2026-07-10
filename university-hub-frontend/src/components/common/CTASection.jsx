const CTASection = ({ setCurrentPage }) => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 py-20 md:py-28 overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold dark:text-white ">Ready to Begin Your Journey?</h2>
        <p className="mt-3 text-gray-500 dark:text-indigo-100 max-w-md mx-auto">Register your interest today and take the first step toward an extraordinary future.</p>
        <button onClick={() => setCurrentPage('register')} className="mt-6 px-10 py-3 dark:bg-purple-700 bg-white  text-indigo-700 dark:text-white font-semibold rounded-xl hover:bg-indigo- dark:hover:bg-purple-600  transition-all shadow-lg shadow-indigo-800/30 dark:shadow-purple-900/10 ">
          <i className="fas fa-pen-to-square mr-2"></i> Register Now
        </button>
      </div>
    </section>
  );
};

export default CTASection;