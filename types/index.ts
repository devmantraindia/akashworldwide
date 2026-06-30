// User Types
export type UserRole = 'CUSTOMER' | 'OPERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus = 
  | 'PENDING' 
  | 'PAYMENT_PENDING' 
  | 'PAYMENT_VERIFIED' 
  | 'PROCESSING' 
  | 'COMPLETED' 
  | 'REJECTED' 
  | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  serviceId: string;
  status: OrderStatus;
  serviceCharge: number;
  governmentFee: number;
  discount: number;
  totalAmount: number;
  formData?: Record<string, any>;
  referenceNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Payment Types
export type PaymentStatus = 
  | 'PENDING' 
  | 'PENDING_VERIFICATION' 
  | 'VERIFIED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CANCELLED';

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  method: 'UPI' | 'BANK_TRANSFER';
  paymentScreenshot?: string;
  utrNumber?: string;
  payerName?: string;
  payerPhone?: string;
  paymentDateTime?: Date;
  verifiedBy?: string;
  verificationNotes?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Service Types
export type ServiceCategory = 
  | 'GOVERNMENT' 
  | 'BANKING' 
  | 'INSURANCE' 
  | 'TRAVEL' 
  | 'RECHARGE' 
  | 'BILL_PAYMENT' 
  | 'CERTIFICATION' 
  | 'OTHER';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  bannerImage?: string;
  categoryId: string;
  serviceCharge: number;
  governmentFee: number;
  processingTime: string;
  benefits?: string;
  eligibility?: string;
  requiredDocuments?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  isActive: boolean;
  displayOrder: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// Document Types
export type DocumentStatus = 'UPLOADED' | 'VERIFIED' | 'REJECTED';

export interface Document {
  id: string;
  orderId: string;
  userId: string;
  type: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  status: DocumentStatus;
  rejectionReason?: string;
  uploadedAt: Date;
  verifiedAt?: Date;
}

// Form Field Types
export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'date' | 'textarea' | 'file';
  placeholder?: string;
  isRequired: boolean;
  isVisible: boolean;
  options?: string[];
  validationPattern?: string;
  helpText?: string;
  displayOrder: number;
}

// Auth Types
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
