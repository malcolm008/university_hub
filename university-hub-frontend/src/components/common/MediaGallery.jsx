const mediaItems = [
  { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop', label: 'Campus Quad' },
  { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=400&fit=crop', label: 'Library' },
  { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop', label: 'Student Life' },
  { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop', label: 'Campus View' },
];

const MediaGallery = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Campus in Focus</h2>
          <p className="mt-2 text-gray-500">Explore our vibrant campus through the lens of our students.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mediaItems.map((item, i) => (
            <div key={i} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
              <img src={item.src} alt={item.label} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                <span className="text-white font-medium text-sm">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaGallery;