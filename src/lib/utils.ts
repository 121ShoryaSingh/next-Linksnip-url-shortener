import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

//Generate a random ID for short URLs
export function nanoid(length: number = 6): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

//format a url for display (remove protocol, etc.)
export function formatUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.hostname}${urlObj.pathname}${urlObj.search}`;
  } catch (error) {
    return url;
  }
}
