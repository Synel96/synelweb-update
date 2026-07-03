# Backend API Requirements (Current Frontend Components)

## Goal

This document defines the minimum backend API data structure needed for the current frontend components:

- Services cards
- Project card
- Reviews carousel

The frontend currently supports 3 languages:

- hu
- en
- de

Recommended strategy: backend returns all 3 language variants in one payload, and frontend picks the active one.

## Common Types

### LocalizedText

Use this for all multilingual fields.

```ts
{
  hu: string;
  en: string;
  de: string;
}
```

### Price

Use separate fields for regular and sale price.

```ts
{
  amount: number; // e.g. 149000
  currency: string; // e.g. "HUF"
}
```

---

## 1) Services Card API

### Required fields per service item

```ts
{
  id: string;
  slug: {
    hu: string;
    en: string;
    de: string;
  };
  title: LocalizedText;
  description: LocalizedText;
  images: string[];      // image URLs for carousel
  price: Price;          // regular price
  salePrice: Price | null; // discounted price, null if not discounted
  isActive: boolean;     // optional but recommended for publish control
  order: number;         // optional sorting field
}
```

### Suggested endpoint

- GET /api/services

### Example response

```json
[
  {
    "id": "svc_landing",
    "slug": {
      "hu": "landing-oldal-fejlesztes",
      "en": "landing-page-development",
      "de": "landingpage-entwicklung"
    },
    "title": {
      "hu": "Landing oldal fejlesztés",
      "en": "Landing Page Development",
      "de": "Landingpage Entwicklung"
    },
    "description": {
      "hu": "Konverzióra optimalizált landing oldal.",
      "en": "Conversion-optimized landing page.",
      "de": "Conversion-optimierte Landingpage."
    },
    "images": [
      "https://cdn.example.com/services/landing/1.webp",
      "https://cdn.example.com/services/landing/2.webp"
    ],
    "price": { "amount": 149000, "currency": "HUF" },
    "salePrice": { "amount": 129000, "currency": "HUF" },
    "isActive": true,
    "order": 1
  }
]
```

---

## 2) Project Card API

### Required fields per project item

```ts
{
  id: string;
  name: string;
  stack: Array<{
    name: string; // e.g. React
    logo: string; // frontend key, e.g. react | tailwind | typescript | python | django | postgresql
  }>;
  description: LocalizedText;

  lighthouseMobile: Array<{
    label: string; // e.g. performance, accessibility, bestPractices, seo
    value: number; // 0..100
  }>;

  lighthouseDesktop: Array<{
    label: string; // e.g. performance, accessibility, bestPractices, seo
    value: number; // 0..100
  }>;

  liveUrl: string; // public URL
  isActive: boolean;
  order: number;
}
```

### Suggested endpoint

- GET /api/projects

### Example response

```json
[
  {
    "id": "prj_synelweb",
    "name": "SynelWeb",
    "stack": [
      { "name": "React", "logo": "react" },
      { "name": "TailwindCSS", "logo": "tailwind" },
      { "name": "TypeScript", "logo": "typescript" },
      { "name": "Python", "logo": "python" },
      { "name": "Django", "logo": "django" },
      { "name": "PostgreSQL", "logo": "postgresql" }
    ],
    "description": {
      "hu": "A SynelWeb saját webes projektje.",
      "en": "SynelWeb's own web project.",
      "de": "Eigenes Webprojekt von SynelWeb."
    },
    "lighthouseMobile": [
      { "label": "performance", "value": 96 },
      { "label": "accessibility", "value": 100 },
      { "label": "bestPractices", "value": 100 },
      { "label": "seo", "value": 100 }
    ],
    "lighthouseDesktop": [
      { "label": "performance", "value": 100 },
      { "label": "accessibility", "value": 100 },
      { "label": "bestPractices", "value": 100 },
      { "label": "seo", "value": 100 }
    ],
    "liveUrl": "https://synelweb.hu",
    "isActive": true,
    "order": 1
  }
]
```

---

## 3) Reviews API

### Required fields per review item

```ts
{
  id: string;
  name: string;
  email: string;
  rating: number; // integer, 0..5
  review: LocalizedText | string; // if user-generated, string is enough; if translated, use LocalizedText
  isApproved: boolean; // true = visible on frontend
  createdAt: string; // ISO datetime
}
```

Important moderation rule:

- Frontend list endpoint should return only approved reviews.

### Suggested endpoints

- GET /api/reviews?approved=true
- POST /api/reviews

### Example GET response

```json
[
  {
    "id": "rev_001",
    "name": "Kiss Bence",
    "email": "bence@example.com",
    "rating": 5,
    "review": "Nagyon gördülékeny volt a közös munka.",
    "isApproved": true,
    "createdAt": "2026-07-03T10:00:00.000Z"
  }
]
```

### Example POST payload (modal submit)

```json
{
  "name": "Kiss Bence",
  "email": "bence@example.com",
  "rating": 5,
  "review": "Nagyon gördülékeny volt a közös munka."
}
```

### Suggested POST response

```json
{
  "id": "rev_123",
  "status": "pending_approval"
}
```

---

## Validation Rules (Recommended)

### Services

- title/description must be present for hu, en, de
- images length >= 1
- price.amount >= 0
- salePrice.amount < price.amount when salePrice exists

### Projects

- stack length >= 1
- lighthouseMobile and lighthouseDesktop should contain the same 4 labels
- each lighthouse value must be between 0 and 100
- liveUrl must be valid URL

### Reviews

- rating must be integer between 0 and 5
- name min length 2
- email valid format
- review min length 10
- default isApproved = false on creation

---

## Minimal Launch Contract

If backend wants to start small, the absolute minimum is:

- /api/services returning multilingual title, description, slug, images, price, salePrice
- /api/projects returning multilingual description, stack, mobile+desktop lighthouse arrays, liveUrl
- /api/reviews POST for submission and GET approved list for display
