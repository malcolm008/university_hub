/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const GalleryContext = createContext();

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

// Default categories
const defaultCategories = [
  { id: 'cat_1', name: 'Campus Life', slug: 'campus-life', icon: 'fa-university', description: 'Explore our vibrant campus and facilities' },
  { id: 'cat_2', name: 'Academic Life', slug: 'academic-life', icon: 'fa-graduation-cap', description: 'Learning environments and classrooms' },
  { id: 'cat_3', name: 'Student Activities', slug: 'student-activities', icon: 'fa-users', description: 'Clubs, sports, and events' },
  { id: 'cat_4', name: 'International', slug: 'international', icon: 'fa-globe', description: 'Diverse community and global connections' },
];

// Load data from localStorage
const storedGalleryData = (() => {
  try {
    const stored = localStorage.getItem('galleryData');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
})();

export const GalleryProvider = ({ children }) => {
  const [categories, setCategories] = useState(
    storedGalleryData.categories || defaultCategories
  );
  const [images, setImages] = useState(
    storedGalleryData.images || []
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Save to localStorage
  const saveGalleryData = useCallback(() => {
    try {
      localStorage.setItem('galleryData', JSON.stringify({
        categories,
        images,
      }));
    } catch (error) {
      console.error('Error saving gallery data:', error);
    }
  }, [categories, images]);

  // Auto-save when data changes
  React.useEffect(() => {
    const timeoutId = setTimeout(saveGalleryData, 300);
    return () => clearTimeout(timeoutId);
  }, [saveGalleryData]);

  // Category CRUD
  const addCategory = useCallback((categoryData) => {
    const newCategory = {
      id: 'cat_' + Date.now(),
      ...categoryData,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback((id, categoryData) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id
          ? { ...cat, ...categoryData, slug: categoryData.name.toLowerCase().replace(/\s+/g, '-') }
          : cat
      )
    );
  }, []);

  const deleteCategory = useCallback((id) => {
    // Also delete all images in this category
    setCategories(prev => prev.filter(cat => cat.id !== id));
    setImages(prev => prev.filter(img => img.categoryId !== id));
  }, []);

  // Image CRUD
  const addImage = useCallback((imageData) => {
    const newImage = {
      id: 'img_' + Date.now(),
      ...imageData,
      uploadedAt: new Date().toISOString(),
    };
    setImages(prev => [...prev, newImage]);
    return newImage;
  }, []);

  const updateImage = useCallback((id, imageData) => {
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, ...imageData } : img
      )
    );
  }, []);

  const deleteImage = useCallback((id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const getImagesByCategory = useCallback((categoryId) => {
    return images.filter(img => img.categoryId === categoryId);
  }, [images]);

  const getCategoryBySlug = useCallback((slug) => {
    return categories.find(cat => cat.slug === slug);
  }, [categories]);

  const getCategoryById = useCallback((id) => {
    return categories.find(cat => cat.id === id);
  }, [categories]);

  const value = useMemo(() => ({
    categories,
    images,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    setIsLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    addImage,
    updateImage,
    deleteImage,
    getImagesByCategory,
    getCategoryBySlug,
    getCategoryById,
  }), [
    categories,
    images,
    selectedCategory,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    addImage,
    updateImage,
    deleteImage,
    getImagesByCategory,
    getCategoryBySlug,
    getCategoryById,
  ]);

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};