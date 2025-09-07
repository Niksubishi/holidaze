import { useState, useCallback, useEffect, useMemo } from 'react';

// Image optimization utilities
export const imageOptimization = {
  // Generate optimized image URL (for services like Cloudinary, ImageKit, etc.)
  generateOptimizedUrl: (originalUrl, options = {}) => {
    // If it's not a valid URL or not an image, return as is
    if (!originalUrl || !originalUrl.startsWith('http')) return originalUrl;

    // For now, return the original URL without modifications to avoid breaking external images
    // In a production app with proper image optimization service, you would:
    // 1. Check if the URL is from a supported optimization service (Cloudinary, ImageKit, etc.)
    // 2. Only apply optimizations to URLs that support them
    // 3. Leave third-party image URLs untouched
    
    return originalUrl;
  },

  // Generate responsive srcSet for different screen sizes
  generateSrcSet: (originalUrl) => {
    // For now, don't generate srcSet to avoid breaking external images
    // Return empty string so browsers use the main src
    return '';
  },

  // Generate sizes attribute for responsive images
  generateSizes: (breakpoints = {}) => {
    const defaultBreakpoints = {
      mobile: '100vw',
      tablet: '50vw', 
      desktop: '33vw',
      ...breakpoints
    };

    return `(max-width: 768px) ${defaultBreakpoints.mobile}, (max-width: 1024px) ${defaultBreakpoints.tablet}, ${defaultBreakpoints.desktop}`;
  },

  // Preload critical images
  preloadImage: (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Create blur placeholder
  createBlurPlaceholder: (originalUrl, quality = 10) => {
    // Return the original URL for blur placeholder
    // The CSS filter will handle the blur effect in the OptimizedImage component
    return originalUrl;
  }
};

// Hook for image optimization
export const useImageOptimization = (originalUrl, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedUrl = useMemo(() => {
    return imageOptimization.generateOptimizedUrl(originalUrl, options);
  }, [originalUrl, options]);

  const srcSet = useMemo(() => {
    return imageOptimization.generateSrcSet(originalUrl);
  }, [originalUrl]);

  const sizes = useMemo(() => {
    return imageOptimization.generateSizes(options.breakpoints);
  }, [options.breakpoints]);

  const blurPlaceholder = useMemo(() => {
    return imageOptimization.createBlurPlaceholder(originalUrl);
  }, [originalUrl]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
  }, []);

  // Preload the image
  useEffect(() => {
    if (originalUrl) {
      imageOptimization.preloadImage(optimizedUrl)
        .then(handleLoad)
        .catch(handleError);
    }
  }, [optimizedUrl, handleLoad, handleError, originalUrl]);

  return {
    optimizedUrl,
    srcSet,
    sizes,
    blurPlaceholder,
    isLoaded,
    hasError,
    handleLoad,
    handleError
  };
};