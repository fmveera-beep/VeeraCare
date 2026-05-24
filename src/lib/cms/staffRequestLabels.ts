import type { CtaInquiryType, ServiceNeeded } from "@prisma/client";
import type { ServiceNeeded as FormServiceNeeded } from "@/lib/validations/cta";

export const formServiceToDb: Record<FormServiceNeeded, ServiceNeeded> = {
  Housemaid: "HOUSEMAID",
  "Nanny/Babysitter": "NANNY_BABYSITTER",
  "Elderly Caretaker": "ELDERLY_CARETAKER",
  "Personal Cook": "PERSONAL_COOK",
  "Private Driver": "PRIVATE_DRIVER",
  "Deep Cleaning": "DEEP_CLEANING",
  "Janitorial Staff": "JANITORIAL_STAFF",
  Plumber: "PLUMBER",
  Electrician: "ELECTRICIAN",
  "Gardener/Landscaper": "GARDENER_LANDSCAPER",
  "General Laborer": "GENERAL_LABORER",
  Mason: "MASON",
  Carpenter: "CARPENTER",
  Painter: "PAINTER",
  "Waitstaff/Catering": "WAITSTAFF_CATERING",
  Bartender: "BARTENDER",
  "Event Setup Crew": "EVENT_SETUP_CREW",
  "General Security Guard": "GENERAL_SECURITY_GUARD",
  "VIP Security": "VIP_SECURITY",
  Bouncer: "BOUNCER",
  "Office Boy/Peon": "OFFICE_BOY_PEON",
  Receptionist: "RECEPTIONIST",
  "Delivery Courier": "DELIVERY_COURIER",
};

const dbServiceToForm = Object.fromEntries(
  Object.entries(formServiceToDb).map(([label, db]) => [db, label])
) as Record<ServiceNeeded, FormServiceNeeded>;

export function serviceNeededLabel(value: ServiceNeeded): string {
  return dbServiceToForm[value] ?? value.replaceAll("_", " ");
}

export function inquiryTypeLabel(value: CtaInquiryType): string {
  return value === "HIRING"
    ? "Employer — needs staff"
    : "Worker — available for work";
}

export function inquiryTypeShort(value: CtaInquiryType): string {
  return value === "HIRING" ? "Hiring" : "Worker";
}
