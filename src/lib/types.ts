export interface ShorternedUrl {
  id: string;
  shorturl: string;
  originalUrl: string;
  createdAt: string;
  clicks: number;
}

export interface UrlDocument {
  _id: string;
  originalUrl: string;
  createdAt: string;
  clicks: number;
}
