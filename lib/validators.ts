import { z } from 'zod';

// Auth Schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Invalid password'),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

// Service Schemas
export const serviceFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(12),
});

// Order Schemas
export const createOrderSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  formData: z.record(z.any()).optional(),
  couponCode: z.string().optional(),
});

// Payment Schemas
export const submitPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  paymentScreenshot: z.string().min(1, 'Payment screenshot is required'),
  utrNumber: z.string().min(1, 'UTR number is required'),
  payerName: z.string().min(1, 'Payer name is required'),
  payerPhone: z.string().min(10, 'Invalid phone number'),
  paymentDateTime: z.date(),
});

// Document Schemas
export const uploadDocumentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  type: z.string().min(1, 'Document type is required'),
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    'File size must be less than 10MB'
  ).refine(
    (file) => ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'File type must be PDF or image'
  ),
});

// Support Ticket Schemas
export const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

// Admin Schemas
export const createServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  serviceCharge: z.number().min(0, 'Service charge must be positive'),
  governmentFee: z.number().min(0, 'Government fee must be positive'),
  processingTime: z.string().min(1, 'Processing time is required'),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
  categoryType: z.enum(['GOVERNMENT', 'BANKING', 'INSURANCE', 'TRAVEL', 'RECHARGE', 'BILL_PAYMENT', 'CERTIFICATION', 'OTHER']),
});

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ServiceFilterInput = z.infer<typeof serviceFilterSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type SubmitPaymentInput = z.infer<typeof submitPaymentSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
