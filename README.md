
  # Movie Ticket Booking System - Frontend

**Coursework:** CMJD 114/115 - Front-End Development with React
**Tech Stack:** React (TypeScript), React Router, Axios, Tailwind CSS, Vite, Spring Boot, MySQL

---

## Overview
This repository contains the full single-page React frontend application for the Movie Ticket Booking System. It interacts with a Spring Boot REST API and MySQL database to deliver user authentication, movie catalog browsing, interactive seat reservation, ticket booking, and booking management.

---

## Features Implemented

### 1. Authentication Handling
* Sign-In & Sign-Up Pages: Clean user authentication interfaces built with React and Tailwind CSS.
* JWT Security: Secure token storage in localStorage with route guards (ProtectedRoute) to prevent unauthorized access.

### 2. Movie Catalog Browsing
* Dynamic Display: Renders available movies with genres, durations, and poster art.
* Search & Filter Controls: Real-time search by movie title and dynamic genre filter dropdown.

### 3. Booking & Seat Selection Interface
* Show & Theatre Selection: Dynamic selection of showtimes, dates, and cinema halls.
* Interactive Seat Grid: Selectable seat matrix updating total pricing in real time based on ticket counts.
* Payment Summary: Direct breakdown of chosen seats, individual seat pricing, and grand total.

### 4. Booking Management
* Booking History: Detailed view of customer bookings (/bookings) displaying theatre, date, time, assigned seats, and total paid.
* Cancellation Logic: Instant booking cancellation calling API endpoints with real-time UI updates.

---

## Project Setup & Installation

### Prerequisites
* Node.js (v18+)
* npm or yarn
* Running Spring Boot backend (http://localhost:8080)

### Steps
1. Clone the repository:
git clone[ https://github.com/chenumiranaweerashc-dev/movie-booking-frontend.git]
cd movie-booking-frontend

2. Install dependencies:
npm install

3. Run development server:
npm run dev

The application will run on http://localhost:5173.

---

## Folder Structure
src/
├── components/ # Reusable UI elements
├── pages/ # Route views (Login, Register, MovieList, BookingHistory)
├── services/ # Axios instance and API call handlers
├── App.tsx # React Router configuration & Protected Routes
└── main.tsx # React entry point

---

## Future Expansion - Student Proposal

###  1: Interactive Theatre Screen & Seat Layout
* Description: Transition from the current matrix grid to a full 2D interactive canvas or SVG mapping of actual cinema hall screen angles, seat tiers (VIP, Standard, Recliner), and real-time occupied seat statuses.
* UX Impact: Provides users with an accurate visual representation of the auditorium screen orientation and view distances, preventing double-bookings and drastically improving confidence during seat selection.

###  2: Online Payment Gateway Integration
* Description: Integrate third-party payment gateways (e.g., Stripe, PayPal, or PayHere) to handle live online credit/debit card transactions directly within the booking flow.
* UX Impact: Converts ticket reservations into immediate, verified purchases with instant automated email receipts, QR code e-tickets, and seamless refund processing upon cancellation.


