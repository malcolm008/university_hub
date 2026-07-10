import { useState, useRef } from 'react';
import { useGallery } from '../context/GalleryContext';
import { useApp } from '../context/AppContext';

const AdminGallery = () => {
  const { 
    categories, 
    images, 
    getImagesByCategory,
    addCategory, 
    updateCategory, 
    deleteCategory,
    addImage,
    updateImage,
    deleteImage
  } = useGallery();
  const { showToast } = useApp();
  
  const [activeTab, setActiveTab] = useState('categories');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  
  const fileInputRef = useRef(null);

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: 'fa-university',
    description: '',
  });

  // Image form state
  const [imageForm, setImageForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    location: '',
    file: null,
    url: '',
  });

  const iconOptions = [
    'fa-university', 'fa-graduation-cap', 'fa-users', 'fa-globe',
    'fa-book', 'fa-flask', 'fa-music', 'fa-futbol',
    'fa-camera', 'fa-paint-brush', 'fa-laptop', 'fa-microscope',
    'fa-tree', 'fa-building', 'fa-heart', 'fa-star'
  ];

  // Category handlers
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      showToast('Category name is required', 'error');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryForm);
      showToast('Category updated successfully!', 'success');
    } else {
      addCategory(categoryForm);
      showToast('Category added successfully!', 'success');
    }
    
    resetCategoryForm();
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      icon: category.icon,
      description: category.description || '',
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Delete this category and all its images?')) {
      deleteCategory(id);
      showToast('Category deleted successfully!', 'success');
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', icon: 'fa-university', description: '' });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  // Image handlers
  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (!imageForm.title || !imageForm.categoryId) {
      showToast('Title and category are required', 'error');
      return;
    }

    const imageData = {
      title: imageForm.title,
      description: imageForm.description,
      categoryId: imageForm.categoryId,
      categoryName: categories.find(c => c.id === imageForm.categoryId)?.name || '',
      location: imageForm.location,
      file: imageForm.file || imageForm.url || 'https://via.placeholder.com/400x300?text=Image',
      url: imageForm.url || '',
    };

    if (editingImage) {
      updateImage(editingImage.id, imageData);
      showToast('Image updated successfully!', 'success');
    } else {
      addImage(imageData);
      showToast('Image added successfully!', 'success');
    }
    
    resetImageForm();
  };

  const handleEditImage = (image) => {
    setEditingImage(image);
    setImageForm({
      title: image.title,
      description: image.description || '',
      categoryId: image.categoryId,
      location: image.location || '',
      file: null,
      url: image.url || '',
    });
    setShowImageForm(true);
  };

  const handleDeleteImage = (id) => {
    if (window.confirm('Delete this image?')) {
      deleteImage(id);
      showToast('Image deleted successfully!', 'success');
    }
  };

  const resetImageForm = () => {
    setImageForm({
      title: '',
      description: '',
      categoryId: '',
      location: '',
      file: null,
      url: '',
    });
    setEditingImage(null);
    setShowImageForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be under 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageForm(prev => ({
          ...prev,
          file: ev.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              <i className="fas fa-camera text-indigo-500 mr-3"></i>
              Gallery Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage categories and images for the campus gallery
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setActiveTab('categories');
                setShowCategoryForm(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> Add Category
            </button>
            <button
              onClick={() => {
                setActiveTab('images');
                setShowImageForm(true);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> Add Image
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'categories'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <i className="fas fa-tags mr-2"></i> Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'images'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <i className="fas fa-images mr-2"></i> Images ({images.length})
          </button>
        </div>

        {/* Category Form Modal */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button onClick={resetCategoryForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                    placeholder="e.g. Campus Life"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                  <select
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>
                        <i className={`fas ${icon}`}></i> {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                    placeholder="Brief description of this category"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all">
                    {editingCategory ? 'Update' : 'Add'} Category
                  </button>
                  <button type="button" onClick={resetCategoryForm} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Image Form Modal */}
        {showImageForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingImage ? 'Edit Image' : 'Add New Image'}
                </h3>
                <button onClick={resetImageForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleImageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={imageForm.title}
                    onChange={(e) => setImageForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                    placeholder="Image title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select
                    value={imageForm.categoryId}
                    onChange={(e) => setImageForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={imageForm.description}
                    onChange={(e) => setImageForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                    placeholder="Image description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={imageForm.location}
                    onChange={(e) => setImageForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                    placeholder="e.g. Main Campus, Library"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 dark:file:bg-indigo-900/30 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50"
                  />
                  {imageForm.file && (
                    <div className="mt-2">
                      <img src={imageForm.file} alt="Preview" className="h-20 rounded-lg object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all">
                    {editingImage ? 'Update' : 'Add'} Image
                  </button>
                  <button type="button" onClick={resetImageForm} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Categories List */}
        {activeTab === 'categories' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => {
              const imageCount = getImagesByCategory(category.id).length;
              return (
                <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
                        <i className={`fas ${category.icon}`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{imageCount} images</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  {category.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Images List */}
        {activeTab === 'images' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map(image => {
              const category = categories.find(c => c.id === image.categoryId);
              return (
                <div key={image.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group">
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src={image.url || image.file}
                      alt={image.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{image.title}</h4>
                    {category && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <i className={`fas ${category.icon} mr-1`}></i>
                        {category.name}
                      </p>
                    )}
                    {image.location && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {image.location}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => handleEditImage(image)}
                        className="flex-1 py-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all text-sm"
                      >
                        <i className="fas fa-edit mr-1"></i> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="flex-1 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all text-sm"
                      >
                        <i className="fas fa-trash mr-1"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;