import {z} from 'zod'


export const verifyCertificateSchema = z.object({
  certCode: z.string()
    .regex(/^CERT-[A-F0-9]{16}$/, 'Invalid certificate code format. Expected format: CERT-XXXXXXXXXXXXXXXX')
});

export const applyTrainerSchema = z.object({
  bio: z.string().min(1, "Bio is required"),
  skills: z.string().min(1, "At least one skill is required"),
  availability: z.string().min(1, "Availability is required"),
  motivation: z.string().min(1, "Motivation is required")
});

