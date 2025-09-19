import { useState, useMemo, useCallback } from 'react';


export const validationRules = {
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : `Must be at least ${min} characters long`;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : `Must be no more than ${max} characters long`;
  },

  min: (min) => (value) => {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return num >= min ? null : `Must be at least ${min}`;
  },

  max: (max) => (value) => {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return num <= max ? null : `Must be no more than ${max}`;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  price: (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) return 'Price must be a number';
    if (num < 0) return 'Price cannot be negative';
    if (num > 10000) return 'Price seems too high';
    return null;
  },

  dateInFuture: (value) => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today ? null : 'Date must be in the future';
  },

  dateRange: (endDateField) => (value, allValues) => {
    if (!value || !allValues[endDateField]) return null;
    const startDate = new Date(value);
    const endDate = new Date(allValues[endDateField]);
    return startDate < endDate ? null : 'Start date must be before end date';
  },

  guests: (maxGuests) => (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || !Number.isInteger(num)) return 'Number of guests must be a whole number';
    if (num < 1) return 'At least 1 guest is required';
    if (maxGuests && num > maxGuests) return `Maximum ${maxGuests} guests allowed`;
    return null;
  },

  imageUrl: (value) => {
    if (!value) return null;
    
    
    try {
      const url = new URL(value);
      
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
      if (!imageExtensions.test(url.pathname)) {
        return 'URL must point to an image file (jpg, jpeg, png, gif, webp, svg)';
      }
      return null;
    } catch {
      return 'Please enter a valid image URL';
    }
  },

  password: (value) => {
    if (!value) return null;
    if (value.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
    return null;
  },

  confirmPassword: (passwordField) => (value, allValues) => {
    if (!value) return null;
    return value === allValues[passwordField] ? null : 'Passwords do not match';
  }
};


export const useFormValidation = (validationSchema = {}) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  
  const validateField = useCallback((fieldName, value, allValues = values) => {
    const fieldRules = validationSchema[fieldName];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      const error = rule(value, allValues);
      if (error) return error;
    }
    return null;
  }, [validationSchema, values]);

  
  const validateForm = useCallback((valuesToValidate = values) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName, valuesToValidate[fieldName], valuesToValidate);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    return { isValid, errors: newErrors };
  }, [validationSchema, validateField, values]);

  
  const setValue = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    
    const error = validateField(fieldName, value, { ...values, [fieldName]: value });
    setErrors(prev => ({ 
      ...prev, 
      [fieldName]: error 
    }));
  }, [validateField, values]);

  
  const setMultipleValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
    
    
    const newErrors = { ...errors };
    Object.keys(newValues).forEach(fieldName => {
      if (validationSchema[fieldName]) {
        const error = validateField(fieldName, newValues[fieldName], { ...values, ...newValues });
        newErrors[fieldName] = error;
      }
    });
    setErrors(newErrors);
  }, [errors, validateField, values, validationSchema]);

  
  const setTouched = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  
  const getFieldProps = useCallback((fieldName) => ({
    value: values[fieldName] || '',
    onChange: (e) => setValue(fieldName, e.target.value),
    onBlur: () => setTouched(fieldName),
    error: touched[fieldName] ? errors[fieldName] : null
  }), [values, setValue, setTouched, touched, errors]);

  
  const reset = useCallback((initialValues = {}) => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, []);

  
  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      
      const validation = validateForm();
      setErrors(validation.errors);
      
      
      const allTouched = {};
      Object.keys(validationSchema).forEach(fieldName => {
        allTouched[fieldName] = true;
      });
      setTouched(allTouched);
      
      if (validation.isValid) {
        onSubmit(values);
      }
    };
  }, [validateForm, validationSchema, values]);

  
  const isValid = useMemo(() => {
    return Object.keys(errors).every(key => !errors[key]);
  }, [errors]);

  const hasErrors = useMemo(() => {
    return Object.keys(errors).some(key => errors[key]);
  }, [errors]);

  const touchedFields = useMemo(() => {
    return Object.keys(touched).filter(key => touched[key]);
  }, [touched]);

  return {
    values,
    errors,
    touched,
    setValue,
    setValues: setMultipleValues,
    setTouched,
    getFieldProps,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    isValid,
    hasErrors,
    touchedFields
  };
};