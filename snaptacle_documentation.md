# Snaptacle Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Folder Structure](#folder-structure)
5. [Configuration](#configuration)
6. [Dependencies](#dependencies)
7. [Running the App](#running-the-app)
8. [Features](#features)
9. [API Endpoints](#api-endpoints)
10. [Contributing](#contributing)
11. [License](#license)


## Introduction
Snaptacle is a social media app developed using Next.js for the client-side and Node.js for the server-side. This documentation provides information on installing, configuring, and running the app, as well as details about its features and API endpoints.

## Installation
To install Snaptacle, follow these steps:

1. Clone the repository: `git clone https://github.com/ujwalbarodia18/snaptacle.git`
2. Navigate to the project directory: `cd snaptacle`
3. Install dependencies for both the client and server: `npm install` in the `client` and `server` directories.


## Getting Started
After installation, access the app in your browser: `http://localhost:3000`


## Folder Structure
The project has the following folder structure:

<pre>
Snaptacle/
|-- src/
|   |-- app/
|   |   |-- components/
|   |   |   |-- Titlebar.jsx
|   |   |   |-- Navbar.jsx
|   |   |   |-- ...
|   |   |-- stylesheets/
|   |   |   |-- feed.css
|   |   |   |-- profile.css
|   |   |   |-- ...
|   |   |-- feed/
|   |   |   |-- page.jsx
|   |   |-- addPost/
|   |   |   |-- page.jsx
|   |   |-- profile/
|   |   |   |-- page.jsx
|   |   |   |-- [profileId]/
|   |   |   |   |-- page.jsx
|   |   |-- ...
|-- server/
|   |-- models/
|   |   |-- chat.js
|   |   |-- post.js
|   |   |-- user.js
|   |   |-- story.js
|   |-- routes/
|   |   |-- index.js
|   |-- tests/
|   |   |-- index.test.js
|-- ...
</pre>

## Configuration
Before running the app, make sure to set up the configuration. 

1. Create a `.env` file in the `server` directory.
2. Update the values with your configuration details, such as database connection strings and API keys.

## Dependencies
Key dependencies include:

- **Client-side (Next.js):**
  - `react`
  - `next`
  - `socket`

- **Server-side (Node.js):**
  - `express`
  - `mongoose`
  - `socket`
  - `nodemailer`
  - `aws-sdk`
  - `jsonwebtoken`


## Running the App
To run the app, use the following commands:

- **Client-side:**  
   - cd client  
   - npm run dev

- **Server-side:**  
   - cd server  
   - npm run dev


## Features
- User authentication
- Posting images
- Following other users
- Encrypted Chatting
- OTP verification
- Post stories
- Search post using hashtags
- Save posts


## Contributing
We welcome contributions! To contribute to Snaptacle, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit: `git commit -m "Add your changes"`.
4. Push to your branch: `git push origin feature/your-feature`.
5. Submit a pull request.

