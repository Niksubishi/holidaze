import { useState, useEffect, useRef, useCallback } from 'react';

export const useLazyLoading = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  const setRef = useCallback((node) => {
    if (elementRef.current) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    }

    elementRef.current = node;

    if (node) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            
            if (triggerOnce) {
              setHasLoaded(true);
              observerRef.current?.disconnect();
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        {
          threshold,
          rootMargin
        }
      );

      observerRef.current.observe(node);
    }
  }, [threshold, rootMargin, triggerOnce]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const shouldLoad = triggerOnce ? hasLoaded || isVisible : isVisible;

  return {
    ref: setRef,
    isVisible: shouldLoad,
    hasLoaded,
    shouldLoad
  };
};

export const useLazyImage = (src, options = {}) => {
  const { ref, shouldLoad } = useLazyLoading(options);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (shouldLoad && src && !imageSrc) {
      setImageSrc(src);
    }
  }, [shouldLoad, src, imageSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
  }, []);

  return {
    ref,
    src: imageSrc,
    isLoaded,
    hasError,
    shouldLoad,
    handleLoad,
    handleError
  };
};

export const useLazyComponent = (importFn, options = {}) => {
  const { shouldLoad } = useLazyLoading(options);
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (shouldLoad && !Component && !isLoading) {
      setIsLoading(true);
      
      importFn()
        .then((module) => {
          setComponent(() => module.default || module);
          setIsLoading(false);
          setHasError(false);
        })
        .catch(() => {
          setHasError(true);
          setIsLoading(false);
        });
    }
  }, [shouldLoad, Component, isLoading, importFn]);

  return {
    Component,
    isLoading,
    hasError,
    shouldLoad
  };
};