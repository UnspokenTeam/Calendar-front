import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const httpClient = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 5000,
})
