import { z } from 'zod'

export const linkFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  url: z.string().url('Please enter a valid URL'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  iconType: z.enum(['emoji', 'font_awesome', 'lucide', 'custom_image']),
  iconValue: z.string().min(1, 'Icon is required'),
  buttonText: z.string().max(20, 'Button text must be less than 20 characters').default('Visit'),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color').optional(),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color').optional(),
})

export const profileFormSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name must be less than 100 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  buttonStyle: z.enum(['rounded', 'square', 'pill']),
  isPublic: z.boolean(),
  seoTitle: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  seoDescription: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
})

export const userRegistrationSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .refine((val) => !['admin', 'api', 'www', 'mail', 'support', 'help', 'about', 'privacy', 'terms'].includes(val.toLowerCase()), {
      message: 'This username is reserved'
    }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
})

export const userLoginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export type LinkFormData = z.infer<typeof linkFormSchema>
export type ProfileFormData = z.infer<typeof profileFormSchema>
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>
export type UserLoginData = z.infer<typeof userLoginSchema> 