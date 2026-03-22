# TechByte: A Full-Stack Technical Developer Blog

**Phase 3 Final Portfolio Submission** **Course:** Project: Getting Started in Web Programming (DLBITPEWP01_E)  
**Developer:** Praise Hope Effiom  

---

## 📖 Project Overview
TechByte is a bespoke, full-stack Content Management System (CMS) functioning as a technical blog. It was built entirely from scratch to demonstrate a comprehensive understanding of client-server architecture, relational databases, and asynchronous JavaScript. 

The platform allows administrators to publish technical articles via a secured backend route, while providing public visitors with an interactive feed and an asynchronous (AJAX-driven) commenting system. This project was developed independently as a comprehensive showcase of full-stack web programming capabilities.

## 🚀 Key Features
* **Bespoke CMS:** Fully functional CRUD operations (Create, Read, Update, Delete) for technical articles.
* **Asynchronous Commenting:** Utilises the Vanilla JavaScript Fetch API to submit comments and update the DOM instantly without full page reloads.
* **Relational Data Management:** Structured SQLite3 database linking 'Posts' and 'Comments' via foreign keys.
* **Dynamic Server-Side Rendering:** Uses EJS to seamlessly inject database rows into HTML templates.
* **Responsive UI:** Built with Bootstrap 5 to ensure a fluid experience across desktop and mobile devices.

## 🛠️ Technology Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API, DOM Manipulation), Bootstrap 5.3
* **Backend:** Node.js, Express.js
* **Database:** SQLite3
* **Templating:** EJS (Embedded JavaScript)

---

## ⚙️ Installation and Setup Guide

To run this application locally on your machine, please follow these steps:

### Prerequisites
* Ensure you have [Node.js](https://nodejs.org/) installed on your system.

### 1. Extract and Navigate
Extract the submitted ZIP folder and open your terminal (or command prompt) within the root directory of the project.

### 2. Install Dependencies
Run the following command to install all required Node modules (Express, EJS, SQLite3, etc.):
```bash
npm install.
```

### 3. Database Setup
The *database.sqlite* file containing the initial seeded articles and comments is already included in the repository. No manual schema initialisation is required.

### 4. Lanuch the Server
Start the Express application by running:
```bash
npm start
```

### 5. Access the Application
Open your web browser and navigate to:
```bash
http://localhost:3000
```


## 🗺️ Application Routing Guide
* **Public Home Page:** `http://localhost:3000/` (Displays the feed of the latest articles).
* **Article Detail View:** Click "Read More" on any article to view its contents and the asynchronous commenting system.
* **Admin Portal:** `http://localhost:3000/admin` (The interface for publishing new technical articles to the database).

---
*Developed independently by Praise Hope Effiom for IU International University of Applied Sciences.*