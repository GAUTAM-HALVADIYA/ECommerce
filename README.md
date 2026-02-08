# MERN E‑commerce Platform

A full‑stack MERN e‑commerce application that delivers a complete storefront experience for customers and a dedicated admin dashboard for catalog and order management. The project is built for production‑style workflows: secure authentication, size‑based cart logic, payment integrations (Stripe, Razorpay, and Cash on Delivery), and Cloudinary‑powered media handling. It is structured as three apps in one repository: `frontend` for customers, `admin` for operations, and `backend` for the API and database layer.

This repository is designed to be a strong portfolio piece for recruiters, internships, and open‑source viewers who want to see clean architecture, pragmatic engineering decisions, and real‑world e‑commerce features.

## Tech Stack

**Frontend (Customer)**
- React (Vite)
- Tailwind CSS
- Context API
- React Router
- Axios
- React Toastify

**Admin Dashboard**
- React (Vite)
- Tailwind CSS
- Axios
- React Toastify

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Authentication**
- JWT (JSON Web Tokens)

**Payments**
- Stripe Checkout
- Razorpay Orders
- Cash on Delivery

**Media**
- Cloudinary

## Features

### Customer Features
- Secure authentication with JWT
- Product listing with filters and sorting
- Product details with size selection
- Size‑based cart management
- Order placement via Stripe, Razorpay, or COD
- Order history with status tracking

### Admin Features
- Admin login
- Add, edit, and delete products
- Image management via Cloudinary
- Order management and status updates

## Project Structure

```
EcommerceApp/
  admin/          # Admin dashboard (React)
  backend/        # API server (Express + MongoDB)
  frontend/       # Customer storefront (React)
  README.md
```

## Installation & Setup

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd EcommerceApp
```

### 2) Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Admin
cd ../admin
npm install
```

## Environment Variables

Create a `.env` file in `backend/`:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create a `.env` file in `frontend/`:

```
VITE_BACKEND_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Create a `.env` file in `admin/`:

```
VITE_BACKEND_URL=http://localhost:5000
```

## Running the Project

### Backend

```bash
cd backend
npm run dev
```

### Frontend (Customer)

```bash
cd frontend
npm run dev
```

### Admin Panel

```bash
cd admin
npm run dev
```

## Payment Gateway Notes

- **Stripe** uses Checkout Sessions created on the server. The client is redirected to the Stripe‑hosted checkout page, and the order is verified on return.
- **Razorpay** uses server‑side order creation. The client opens the Razorpay Checkout modal, then verifies payment by calling the backend.
- **Cash on Delivery** skips external payment gateways and marks the order as unpaid until manual confirmation.

## Security Notes

- Protected API routes require JWT authentication.
- Server calculates final order totals using product prices from the database to prevent client‑side price tampering.
- Order payment status is only updated after server‑side verification.

## API Overview (High‑Level)

**Auth**
- Login and token‑based access

**Products**
- List products
- Create/update/delete products (admin)

**Cart**
- Add to cart
- Update quantities
- Fetch cart state

**Orders**
- Place order (COD, Stripe, Razorpay)
- Verify payment
- Fetch user orders
- Update order status (admin)

## Future Improvements

- Razorpay signature verification for stronger fraud protection
- Role‑based access control for admin operations
- Inventory and stock management
- Order cancellation and refund flow
- End‑to‑end tests and integration tests
- Email notifications for order updates

## Author / Contact

**Gautam**  
Email: <halvadiyagautam57@gmail.com>  
LinkedIn: <https://www.linkedin.com/in/gautam-halvadiya/>  


