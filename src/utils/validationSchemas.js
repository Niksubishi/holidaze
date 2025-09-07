import { validationRules } from '../hooks/useFormValidation';

// Venue form validation schema
export const venueValidationSchema = {
  name: [
    validationRules.required,
    validationRules.minLength(3),
    validationRules.maxLength(100)
  ],
  description: [
    validationRules.required,
    validationRules.minLength(10),
    validationRules.maxLength(1000)
  ],
  price: [
    validationRules.required,
    validationRules.price
  ],
  maxGuests: [
    validationRules.required,
    validationRules.min(1),
    validationRules.max(100)
  ],
  'location.address': [
    validationRules.maxLength(200)
  ],
  'location.city': [
    validationRules.maxLength(100)
  ],
  'location.country': [
    validationRules.maxLength(100)
  ],
  'media.0.url': [
    validationRules.imageUrl
  ],
  'media.0.alt': [
    validationRules.maxLength(200)
  ]
};

// Booking form validation schema
export const bookingValidationSchema = (maxGuests) => ({
  dateFrom: [
    validationRules.required,
    validationRules.dateInFuture,
    validationRules.dateRange('dateTo')
  ],
  dateTo: [
    validationRules.required,
    validationRules.dateInFuture
  ],
  guests: [
    validationRules.required,
    validationRules.guests(maxGuests)
  ]
});

// Authentication form validation schemas
export const loginValidationSchema = {
  email: [
    validationRules.required,
    validationRules.email
  ],
  password: [
    validationRules.required
  ]
};

export const registerValidationSchema = {
  name: [
    validationRules.required,
    validationRules.minLength(2),
    validationRules.maxLength(50)
  ],
  email: [
    validationRules.required,
    validationRules.email
  ],
  password: [
    validationRules.required,
    validationRules.password
  ],
  confirmPassword: [
    validationRules.required,
    validationRules.confirmPassword('password')
  ]
};

// Profile form validation schema
export const profileValidationSchema = {
  bio: [
    validationRules.maxLength(500)
  ],
  'avatar.url': [
    validationRules.imageUrl
  ],
  'avatar.alt': [
    validationRules.maxLength(200)
  ],
  'banner.url': [
    validationRules.imageUrl
  ],
  'banner.alt': [
    validationRules.maxLength(200)
  ]
};

// Contact form validation schema
export const contactValidationSchema = {
  name: [
    validationRules.required,
    validationRules.minLength(2),
    validationRules.maxLength(100)
  ],
  email: [
    validationRules.required,
    validationRules.email
  ],
  subject: [
    validationRules.required,
    validationRules.minLength(5),
    validationRules.maxLength(200)
  ],
  message: [
    validationRules.required,
    validationRules.minLength(10),
    validationRules.maxLength(1000)
  ]
};