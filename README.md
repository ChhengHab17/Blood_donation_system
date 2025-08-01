# Blood_donation_system
A Blood Donation System is a web-based platform that manages and streamlines blood donations by connecting donors, medical staff, and donation centers—handling registrations, appointments, inventory, and donation records efficiently.
# Project Features
- __Blood Inventory__: allow the user to view blood that is in store.

- __Donor Management__: allow medical staff to manage donor and donor status.

- __Donation appointment__: approve donor appointment and assign staff to donation slots.

- __Blood request handling__: view and approve or reject on the request for blood.

- __Report__: generating report for donation center.

- __Blood request__: allow users to request for blood.

- __Notification system__: notify for low blood in stock and upcoming appointment.

# How to set up
1. Set up a database
2. Fill in the .env file with the database credentials and token secret
3. Install Dependencies
   - Backend:
      - bcrypt
      - cors
      - dotenv
      - express-validator
      - jsonwebtoken
      - pg (PostgreSQL driver)
      - pg-hstore
      - sequelize
   - Frontend
      - axios
      - lucide-react
      - react-dom
      - tailwindcss
  # How to start
  1. go to backend
  ```js
     npm install
  ```
  ```js
     npm install dependencies
  ```
  ```js
     npm run dev
  ```
  2. go to frontend
  ```js
    npm run dev
  ```
  ```js
     npm install dependencies
  ```
  ```js
    npm run dev
  ```
