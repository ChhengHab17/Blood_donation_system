# Blood Donation System Backend - Appointments Only

A Node.js/Express.js backend API for managing blood donation appointments using PostgreSQL.

## Features

- **Appointment Management**: Full CRUD operations for blood donation appointments
- **PostgreSQL Database**: Robust relational database with proper relationships
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Proper error handling and response formatting
- **Pagination**: Built-in pagination for appointment listings
- **Search & Filtering**: Search appointments by user details and filter by status
- **Statistics**: Get appointment statistics and overview data

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medical_staff/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb blood_donation_system
   
   # Run the schema file
   psql -d blood_donation_system -f database/schema.sql
   ```

4. **Create environment file**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=blood_donation_system
   DB_PASSWORD=your_password_here
   DB_PORT=5432

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Appointments

#### Get All Appointments
```
GET /api/appointments
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status ('pending', 'approved', 'not approved', 'completed', 'cancelled')
- `search` (optional): Search by user name or email

**Response:**
```json
{
  "appointments": [
    {
      "appointment_id": 1,
      "date_time": "2024-01-15T10:00:00Z",
      "status": "pending",
      "user_id": 1,
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane.doe@email.com",
      "phone_num": "+1-555-0125",
      "gender": "Female",
      "DoB": "1990-05-15",
      "blood_type": "A+",
      "center_id": 1,
      "center_name": "Central Blood Bank",
      "center_address": "123 Main Street",
      "center_city": "New York"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}
```

#### Get Appointment by ID
```
GET /api/appointments/:id
```

#### Create Appointment
```
POST /api/appointments
```
**Body:**
```json
{
  "user_id": 1,
  "center_id": 1,
  "date_time": "2024-01-15T10:00:00Z",
  "status": "pending"
}
```

#### Update Appointment
```
PUT /api/appointments/:id
```
**Body:**
```json
{
  "date_time": "2024-01-15T11:00:00Z",
  "status": "approved"
}
```

#### Update Appointment Status
```
PATCH /api/appointments/:id/status
```
**Body:**
```json
{
  "status": "approved"
}
```

#### Delete Appointment
```
DELETE /api/appointments/:id
```

#### Get Appointment Statistics
```
GET /api/appointments/stats/overview
```
**Response:**
```json
{
  "total": 10,
  "today": 2,
  "statusBreakdown": {
    "pending": 3,
    "approved": 4,
    "not approved": 1,
    "completed": 1,
    "cancelled": 1
  }
}
```

## Database Schema

The system uses the following main tables:

- **appointment**: Stores appointment information
- **users**: User/donor information
- **donation_center**: Blood donation centers
- **blood_type**: Blood type definitions
- **medical_staff**: Medical staff information

### Key Relationships

- Appointments are linked to users and donation centers
- Users have blood types and personal information
- Medical staff are associated with donation centers

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error information (in development)"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## Development

### Scripts

- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm test`: Run tests (not implemented yet)

### Code Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection
├── database/
│   └── schema.sql           # Database schema
├── routes/
│   └── appointmentRoutes.js # Appointment endpoints
├── server.js                # Main application file
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Comprehensive validation
- **SQL Injection Protection**: Parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support, please contact the development team or create an issue in the repository. 