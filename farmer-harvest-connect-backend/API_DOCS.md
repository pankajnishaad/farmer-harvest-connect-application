# Farmer Harvest Connect — REST API Reference

**Base URL:** `http://localhost:5000/api`  
**Auth:** Bearer Token (JWT) in `Authorization: Bearer <token>` header

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [Farmer Routes](#2-farmer-routes)
3. [Provider Routes](#3-provider-routes)
4. [Buyer Routes](#4-buyer-routes)
5. [Admin Routes](#5-admin-routes)
6. [Feedback Routes](#6-feedback-routes)
7. [Error Format](#7-error-format)
8. [Response Format](#8-response-format)

---

## 1. Authentication

### POST `/auth/register`
Register a new Farmer / Provider / Buyer (admin cannot self-register).

**Body:**
```json
{
  "name": "Ramesh Patel",
  "email": "ramesh@farmer.com",
  "password": "Farmer@123",
  "phone": "9876543210",
  "role": "farmer",
  "profile": { "location": "Indore, MP" }
}
```
**Response `201`:**
```json
{
  "success": true,
  "data": { "token": "eyJ...", "user": { "_id": "...", "name": "Ramesh Patel", "role": "farmer" } }
}
```

---

### POST `/auth/login`
Login for all roles. Pass `"role": "admin"` to enforce admin-only login.

**Body:**
```json
{ "email": "ramesh@farmer.com", "password": "Farmer@123" }
```

---

### GET `/auth/me` 🔒
Returns the currently authenticated user's profile.

---

### PUT `/auth/profile` 🔒
Update own name, phone, or profile object.

---

### PUT `/auth/change-password` 🔒
```json
{ "currentPassword": "old", "newPassword": "new6chars" }
```

---

## 2. Farmer Routes
> All routes require: `Authorization: Bearer <token>` with role `farmer`

### POST `/farmer/requirements`
Post a new harvest logistics requirement.

**Body:**
```json
{
  "vehicleType": "Truck (10 Ton)",
  "manpower": 5,
  "cropType": "Wheat",
  "quantity": { "amount": 200, "unit": "Quintal" },
  "duration": { "value": 3, "unit": "Days" },
  "location": { "address": "Sanwer, Indore, MP", "state": "Madhya Pradesh" },
  "urgency": "urgent",
  "notes": "Access road is kaccha"
}
```

---

### GET `/farmer/requirements/my`
My posted requirements. Query: `?status=open&page=1&limit=10`

---

### PATCH `/farmer/requirements/:id`
Update or cancel a requirement.

---

### GET `/farmer/offers`
All service bids received on my requirements.  
Query: `?status=pending|accepted|rejected`

---

### PATCH `/farmer/offers/:bidId`
Accept or reject a provider bid.

**Body:** `{ "status": "accepted" }` or `{ "status": "rejected" }`

> Accepting auto-rejects all other pending bids on the same requirement.

---

### POST `/farmer/crop-listing`
Post a crop for sale. Supports `multipart/form-data` with `image` file field.

**Fields:**
```
cropName, category, quantity.amount, quantity.unit,
price.amount, price.unit, price.negotiable,
location.address, location.district, location.state,
harvest.date, harvest.season, harvest.grade,
description, image (file)
```

---

### GET `/farmer/crop-listing/my`
My crop listings. Query: `?status=active|sold&page=1`

---

### PATCH `/farmer/crop-listing/:id`
Edit a listing (also supports new image upload).

---

### DELETE `/farmer/crop-listing/:id`
Remove a listing.

---

### GET `/farmer/buyer-offers`
All buyer offers on my crop listings.  
Query: `?status=pending|accepted|rejected`

---

### PATCH `/farmer/buyer-offers/:offerId`
Respond to a buyer's offer.

**Body:**
```json
{ "status": "accepted" }
// or counter-offer:
{ "status": "counter", "counterPrice": 2050, "counterMessage": "Minimum 150 Qtl" }
```

---

## 3. Provider Routes
> Role: `provider`

### POST `/provider/service`
Post a new service listing.

**Body:**
```json
{
  "vehicleDetails": { "type": "Truck (10 Ton)", "count": 3, "capacity": "10 Ton" },
  "manpowerDetails": { "available": 0 },
  "pricePerDay": 4200,
  "serviceType": "transport",
  "availability": { "isAvailable": true },
  "serviceArea": { "states": ["Madhya Pradesh"], "radius": 200 }
}
```

---

### GET `/provider/service/my`
My service listings.

---

### PUT `/provider/service/:id`
Update a service listing.

---

### DELETE `/provider/service/:id`
Delete a service listing.

---

### GET `/provider/farmer-requests`
Browse open harvest requirements.  
Query: `?cropType=Wheat&vehicleType=Truck+%2810+Ton%29&state=MP&urgency=urgent&page=1`

---

### POST `/provider/bid`
Submit a bid on a harvest requirement.

**Body:**
```json
{
  "requirementId": "64abc...",
  "serviceId": "64def...",
  "price": 4000,
  "priceType": "per-day",
  "message": "Available immediately, 3 trucks ready"
}
```

---

### GET `/provider/bids/my`
My submitted bids. Query: `?status=pending|accepted|rejected`

---

### DELETE `/provider/bids/:bidId`
Withdraw a pending bid.

---

### GET `/provider/bookings`
Confirmed bookings (accepted bids).

---

### PATCH `/provider/bookings/:bidId/complete`
Mark a booking as completed.

---

## 4. Buyer Routes
> Listing browse is public. Offer/order routes require role: `buyer`

### GET `/buyer/crop-listings` (public)
Browse all active crop listings.

**Query params:**
| Param | Description |
|-------|-------------|
| `search` | Full-text search in cropName, description, location |
| `cropName` | Filter by crop name |
| `category` | Cereals / Pulses / Oilseeds / Vegetables / Fruits / Cash Crops |
| `state` | Filter by state |
| `district` | Filter by district |
| `minPrice` | Minimum price per unit |
| `maxPrice` | Maximum price per unit |
| `season` | Kharif / Rabi / Zaid |
| `grade` | A / B / C / Premium |
| `sort` | `newest` `oldest` `price_asc` `price_desc` `popular` |
| `page` | Page number (default 1) |
| `limit` | Items per page (default 10, max 100) |

---

### GET `/buyer/crop-listings/:id` (public)
Single crop listing detail.

---

### POST `/buyer/make-offer` 🔒
Make an offer on a crop listing.

**Body:**
```json
{
  "listingId": "64abc...",
  "offerPrice": 2050,
  "quantity": { "amount": 100, "unit": "Quintal" },
  "message": "Interested in bulk purchase"
}
```

---

### GET `/buyer/my-offers` 🔒
My submitted crop offers. Query: `?status=pending|accepted|rejected`

---

### POST `/buyer/purchase` 🔒
Initiate a purchase after farmer accepts offer.

**Body:**
```json
{
  "offerId": "64abc...",
  "paymentMethod": "NEFT",
  "transactionId": "UTR12345",
  "notes": "Will pick up Monday"
}
```

---

### POST `/buyer/upload-receipt/:purchaseId` 🔒
Upload payment receipt. `multipart/form-data` with `receipt` field (image/PDF, max 5MB).

---

### GET `/buyer/orders` 🔒
My purchase history. Query: `?status=pending|receipt-uploaded|completed|disputed`

---

### GET `/buyer/orders/:id` 🔒
Single order details.

---

## 5. Admin Routes
> Role: `admin`

### GET `/admin/dashboard-stats`
Returns comprehensive platform analytics:
- User counts (total / farmers / providers / buyers)
- Listing stats (total / active)
- Transaction stats (total / pending receipts / completed / total revenue)
- Bid stats
- Recent users and purchases
- Monthly sales chart data (last 6 months)

---

### GET `/admin/users`
All users. Query: `?role=farmer&isBlocked=false&search=ramesh&page=1&limit=20`

---

### GET `/admin/users/:id`
Single user profile.

---

### PUT `/admin/block-user/:id`
Toggle block/unblock a user. Cannot block another admin.

---

### DELETE `/admin/users/:id`
Permanently delete a user.

---

### GET `/admin/transactions`
All purchases. Query: `?paymentStatus=receipt-uploaded&page=1`

---

### PATCH `/admin/transactions/:id/verify`
Verify an uploaded receipt and mark purchase as `completed`. Auto-marks listing as `sold`.

---

### PATCH `/admin/transactions/:id/dispute`
Flag a transaction as disputed.

**Body:** `{ "reason": "Receipt appears fraudulent" }`

---

### GET `/admin/listings`
All crop listings. Query: `?status=active&cropName=Wheat&page=1`

---

### DELETE `/admin/listings/:id`
Remove a listing from the platform.

---

### PATCH `/admin/listings/:id/status`
**Body:** `{ "status": "withdrawn" }` (active / withdrawn / expired)

---

### GET `/admin/disputes`
All disputed transactions.

---

### PATCH `/admin/disputes/:id/resolve`
Resolve a dispute.

**Body:** `{ "resolution": "completed" }` or `{ "resolution": "refunded" }`

---

## 6. Feedback Routes

### POST `/feedback` 🔒
Submit feedback for any user.

**Body:**
```json
{
  "toUser": "64abc...",
  "rating": 5,
  "comment": "Excellent quality crops, honest farmer.",
  "referenceType": "purchase",
  "referenceId": "64xyz...",
  "tags": ["on-time", "quality-produce"]
}
```

---

### GET `/feedback/user/:userId` (public)
All public feedback for a user. Query: `?page=1&limit=10`

---

### GET `/feedback/my` 🔒
Feedback I have submitted.

---

### DELETE `/feedback/:id` 🔒
Delete own feedback.

---

## 7. Error Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email is required" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```

**HTTP status codes used:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (missing/invalid/expired token) |
| 403 | Forbidden (wrong role or blocked) |
| 404 | Not Found |
| 409 | Conflict (duplicate key) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## 8. Response Format

All responses follow this structure:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... }
}
```

Paginated responses include:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 45,
    "page": 2,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

---

## Quick Start

```bash
# 1. Install
cd fhc-backend && npm install

# 2. Configure
cp .env.example .env
# Edit MONGO_URI in .env

# 3. Seed database (optional)
npm run seed

# 4. Start dev server
npm run dev
# Server: http://localhost:5000
# Health: http://localhost:5000/health

# 5. Test auth
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ramesh@farmer.com","password":"Farmer@123"}'
```
