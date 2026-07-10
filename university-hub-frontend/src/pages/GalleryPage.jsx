import { useState, useEffect } from 'react';
import { useGallery } from '../context/GalleryContext';

const GalleryPage = ({ setCurrentPage }) => {
  const { categories, images, getImagesByCategory, selectedCategory, setSelectedCategory } = useGallery();
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    if (activeCategory) {
      const categoryImages = getImagesByCategory(activeCategory.id);
      setFilteredImages(categoryImages);
    } else if (categories.length > 0) {
      // Show first category by default
      setActiveCategory(categories[0]);
    }
  }, [activeCategory, categories, getImagesByCategory]);

  // Handle image click for lightbox
  const handleImageClick = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Handle keyboard escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="min-h-screenpy-8 px-4 transition-colors duration-300 absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-indigo-600/5 dark:from-purple-600/20 dark:via-transparent dark:to-indigo-600/20">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <i className="fas fa-images text-indigo-500 mr-3"></i>
            Campus Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our vibrant campus through the lens of our students. Browse through different categories to see what life at our university is really like.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeCategory?.id === category.id
                  ? 'bg-indigo-600 dark:bg-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-purple-900/30 scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
              }`}
            >
              <i className={`fas ${category.icon}`}></i>
              <span>{category.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeCategory?.id === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {getImagesByCategory(category.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Category Description */}
        {activeCategory && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {activeCategory.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {activeCategory.description}
            </p>
          </div>
        )}

        {/* Image Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">
              <i className="fas fa-camera"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              No images in this category yet
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Check back soon for new photos!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => handleImageClick(image)}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800"
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={image.url || image.file}
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    {image.description && (
                      <p className="text-sm text-gray-200 mt-1 line-clamp-2">{image.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-300">
                      <span>
                        <i className="far fa-calendar-alt mr-1"></i>
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </span>
                      {image.location && (
                        <span>
                          <i className="fas fa-map-marker-alt mr-1"></i>
                          {image.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    <i className="fas fa-expand"></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-6xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
              
              <img
                src={selectedImage.url || selectedImage.file}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
                <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-gray-300 mt-1">{selectedImage.description}</p>
                )}
                <div className="flex gap-4 text-sm text-gray-400 mt-2">
                  <span>
                    <i className="far fa-calendar-alt mr-1"></i>
                    {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                  </span>
                  {selectedImage.location && (
                    <span>
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      {selectedImage.location}
                    </span>
                  )}
                  <span>
                    <i className="fas fa-tag mr-1"></i>
                    {selectedImage.categoryName || 'Uncategorized'}
                  </span>
                </div>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
                  setSelectedImage(filteredImages[prevIndex]);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-3xl"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                  const nextIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
                  setSelectedImage(filteredImages[nextIndex]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-3xl"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage; // ✅ Make sure this line exists!