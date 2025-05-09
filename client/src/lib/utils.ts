import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function validatePostcode(postcode: string): boolean {
  // Basic UK E20 postcode validation - checks for E20 prefix (case-insensitive)
  // and roughly follows UK postcode format
  const regex = /^[Ee]20\s*[0-9][A-Za-z]{2}$/;
  return regex.test(postcode);
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
