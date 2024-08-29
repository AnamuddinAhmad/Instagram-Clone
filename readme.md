# InstaClone

InstaClone is a simple Instagram clone built using Node.js, Express.js, and MongoDB with server-side rendering using EJS templates. The application implements RESTful API design and features such as user authentication, image uploads, and dynamic content display.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication using Passport.js with local strategy
- RESTful API integration for seamless data interaction
- Image and video upload functionality using Multer
- MongoDB database integration for storing user data and posts
- Server-side rendering using EJS templates

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications
- **Express.js**: Fast, unopinionated web framework for Node.js
- **MongoDB & Mongoose**: NoSQL database and object data modeling (ODM) library
- **EJS**: Embedded JavaScript templating for server-side rendering
- **Multer**: Middleware for handling file uploads
- **Passport.js**: Authentication middleware for Node.js
- **dotenv**: Loads environment variables from a `.env` file

## Getting Started

### Prerequisites

- **Node.js** (v16.x or higher)
- **npm** (Node Package Manager)
- **MongoDB** (Local installation or a cloud-based service like MongoDB Atlas)

### Installation

**1. Clone the repository:**

  ```bash
git clone https://github.com/yourusername/instaclone.git
cd instaclone
```

### Key Sections Explained
- **Environment Variables:** Instructions on setting up the `.env` file with the required variables.
- **Running the Application:** Step-by-step guide to start the application locally.
- **Dependencies:** Detailed list of all dependencies with brief descriptions of their purposes.

Let me know if you need any more details or further customization!
## Dependencies

Here is a list of the major dependencies used in the project:

- **[cookie-parser](https://www.npmjs.com/package/cookie-parser)**: Parses cookies attached to the client request object.
- **[debug](https://www.npmjs.com/package/debug)**: Small debugging utility for Node.js.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Loads environment variables from a `.env` file into `process.env`.
- **[ejs](https://www.npmjs.com/package/ejs)**: Embedded JavaScript templating for rendering dynamic HTML.
- **[express](https://www.npmjs.com/package/express)**: Fast, unopinionated, minimalist web framework for Node.js.
- **[express-session](https://www.npmjs.com/package/express-session)**: Session middleware for Express.
- **[http-errors](https://www.npmjs.com/package/http-errors)**: Creates HTTP errors for Express apps.
- **[mongodb](https://www.npmjs.com/package/mongodb)**: MongoDB driver for Node.js.
- **[mongoose](https://www.npmjs.com/package/mongoose)**: Elegant MongoDB object modeling for Node.js.
- **[morgan](https://www.npmjs.com/package/morgan)**: HTTP request logger middleware for Node.js.
- **[multer](https://www.npmjs.com/package/multer)**: Middleware for handling multipart/form-data, primarily for file uploads.
- **[passport](https://www.npmjs.com/package/passport)**: Simple, unobtrusive authentication for Node.js.
- **[passport-local](https://www.npmjs.com/package/passport-local)**: Passport strategy for authenticating with a username and password.
- **[passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose)**: Mongoose plugin that simplifies building username and password login with Passport.
### Environment Variables

Create a `.env` file in the root directory and add your environment variables:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```
### Set up MongoDB

Ensure that your MongoDB service is running locally or connect to your MongoDB Atlas cluster.

### Running the Application

Start the server using the following command:

```bash
npm start
```
<div align="center">
<h1>Thank You!</h1>
</div>
