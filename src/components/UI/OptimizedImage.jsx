import React, { memo, useMemo, useState } from 'react';
import { useImageOptimization } from '../../hooks/useImageOptimization';
import { useLazyImage } from '../../hooks/useLazyLoading';
import { useTheme } from '../../context/ThemeContext';

const OptimizedImage = memo(({
  src,
  alt = '',
  width,
  height,
  quality = 80,
  className = '',
  lazy = true,
  showPlaceholder = true,
  placeholderClassName = '',
  fallbackSrc = '/images/default.jpg',
  onLoad,
  onError,
  style = {},
  breakpoints = {},
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const [currentSrc, setCurrentSrc] = useState(src);

  
  const {
    optimizedUrl,
    srcSet,
    sizes,
    blurPlaceholder,
    isLoaded: imageLoaded,
    hasError: imageError
  } = useImageOptimization(currentSrc, {
    width,
    height,
    quality,
    breakpoints
  });

  
  const {
    ref,
    src: lazySrc,
    isLoaded: lazyLoaded,
    hasError: lazyError,
    shouldLoad,
    handleLoad: handleLazyLoad,
    handleError: handleLazyError
  } = useLazyImage(lazy ? optimizedUrl : null, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  
  const finalSrc = lazy ? lazySrc : optimizedUrl;
  const isLoaded = lazy ? lazyLoaded && imageLoaded : imageLoaded;
  const hasError = lazy ? lazyError || imageError : imageError;

  
  const handleImageLoad = (e) => {
    if (lazy) handleLazyLoad();
    if (onLoad) onLoad(e);
  };

  
  const handleImageError = (e) => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      if (lazy) handleLazyError();
      if (onError) onError(e);
    }
  };

  
  const placeholderStyle = useMemo(() => ({
    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  }), [isDarkMode, style]);

  
  const imageStyle = useMemo(() => ({
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
    ...style
  }), [isLoaded, style]);

  
  if (hasError) {
    return (
      <div
        className={`${className} ${placeholderClassName}`}
        style={placeholderStyle}
        {...props}
      >
        <div className="text-center text-gray-500">
          <svg
            className="h-8 w-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">Failed to load image</p>
        </div>
      </div>
    );
  }

  
  return (
    <div
      ref={lazy ? ref : undefined}
      className={`relative ${className}`}
      style={style}
      {...props}
    >
      
      {showPlaceholder && !isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center animate-pulse"
          style={{
            backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
            zIndex: 1
          }}
        >
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      
      {finalSrc && (
        <img
          src={finalSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          style={{
            transition: 'opacity 0.3s ease-in-out',
            opacity: isLoaded ? 1 : 0,
            zIndex: 2,
            position: 'relative'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={lazy ? 'lazy' : 'eager'}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;