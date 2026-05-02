import { z } from "zod";

export const serviceNeededOptions = [
  "Housemaid",
  "House Cleaner",
  "Technician",
  "Construction",
  "Event",
  "Security Personnel",
] as const;

export type ServiceNeeded = (typeof serviceNeededOptions)[number];

export const ctaRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(32)
    .regex(/^[0-9+()\-.\s]+$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  serviceNeeded: z.enum(serviceNeededOptions),
  message: z.string().min(1, "Message is required").max(2000),
});

export type CTARequestInput = z.infer<typeof ctaRequestSchema>;

