# Airtable Form Builder – Full Stack MERN Project

This is a full-stack Airtable-style Form Builder application built using **MongoDB, Express, React, and Node.js (MERN)**.

It allows users to:

- Log in using a mock login system  
- Create custom forms with dynamic questions  
- Auto-generate unique question keys and Airtable field IDs  
- Submit responses to created forms  
- View all form responses  
- Store all user, form, and response data in MongoDB  

This project is the final submission for the assignment.

---

## 🚀 Features

### ✅ **User Authentication**
- Simple mock login  
- User ID is stored in localStorage  
- No password required (quick testing)

### ✅ **Form Builder**
- Create forms with:
  - Short Text
  - Long Text
  - Single Select
  - Multi Select
- Add multiple questions  
- Mark questions as *required*  
- Auto-generates:
  - `questionKey` → used to store answers
  - `airtableFieldId` → mimics Airtable fields

### ✅ **Form Submission**
- Any user can fill the form using the generated URL  
- Responses stored in database  
- Supports text inputs and multiselect values

### ✅ **Response Viewer**
- View all responses of a specific form  
- Clean and readable format

### ✅ **Backend (Node.js + Express)**
- REST API for forms, responses, and users  
- MongoDB using Mongoose  
- Middlewares and validation  
- Airtable Client structure included (extendable)

### ✅ **Frontend (React + Vite)**
- Pages:
  - Login Page
  - Form Builder Page
  - Form Submit Page
  - Response Viewer Page
- React Router for navigation  
- Clean UI and simple code structure  

---

## 🗂 Project Structure

