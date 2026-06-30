import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type User = {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role: 'CUSTOMER' | 'OPERATOR' | 'ADMIN' | 'SUPER_ADMIN';
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
};

export type UserRole = 'CUSTOMER' | 'OPERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}
