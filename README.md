# Project Vendor
Our project is a role-based web application built with Django and React, designed for a university setting where students and vendors interact. The application enables users to register as either a student or a vendor. Students can place job offers, while vendors can browse events and accept offers. Our website also facilitates discussions and negotiations between both parties. The app also allows vendors to upload and manage items in their inventories as sales happen during the event. 
This project was created as part of NUS' Orbital Apollo 11 program. 

LINK TO DEPLOYED APP: https://orbital-frontend-w4z9.onrender.com/ (deployment expired, please manually set it up on your local machine)

## Motivation 
There are many CCAs and societies in NUS that hold fundraisers to raise money for their CCAs, projects and causes. Oftentimes, they call down small local vendors to sell their items. The relationship between these two parties are symbiotic as these NUS based CCAs offer the vendors a chance to sell their items while the vendors help the students to raise money. However, there seems to be a lack of a centralised platform for both parties to connect with one another as they are unaware of each other’s existence. As a result, these student groups often spam many of these vendors DMs on social media platforms. With a more centralised platform like ours, they could essentially save the time spent chasing these vendors.  During the fundraisers, inventory management and revenue sharing becomes a very tricky affair. Whilst excel sheets can be used, nothing beats a human-friendly UI that is also able to automate some transactions. 

## User Stories 
- As a student group who wants to attract vendors for their fundraisers, they will be able to post descriptions of their upcoming fundraisers or accept the requests of vendors seeking to sell items.
- As a vendor who wants to have a crowd to sell to, they will be able to request for a job or accept the request for vendors for a fundraiser hosted by a student group, as well as manage product sales.

## Uniqueness of our app
There are many apps out there that aim to bring buyers and sellers together such as Carousell and Ebay. However, these apps target one-off transactions. More importantly, this app hopes to bring (student) organizations and small vendors together, both of whom lack the clout and resources to seek opportunities for themselves. The app also aims to double up as an inventory management system during the fundraisers themselves.

## Features
- User authentication
- Job posting and viewing
- Making a Job offer
- Vendor inventory management
- Item purchase handling
- Filtering and sorting system
- User profiles
- Messaging system
- Review System
- Fundraiser dashboards & analytics


## Getting Started
Follow the steps below to get this project running on your local machine.

### Prerequisites
- Python 3.6+
- pip
- Node.js v14+
- npm or yarn
- PostgreSQL
- Git
- A web browser

### Setting up the Backend

1. **Clone the Repository**
```
git clone https://github.com/hai0506/orbital.git
cd orbital
```
2. **Create a Virtual Environment**
```
cd .\backend\
python -m venv env
```
3. **Activate the Virtual Environment**
   
On macOS/Linux:
```
source env/bin/activate
```
On Windows:
```
env\Scripts\activate
```
4. **Install Dependencies**
```   
pip install -r requirements.txt
```
5. **Install PostgreSQL**

https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

Follow instructions in the installer.

6. **Create the database**

In psql, enter:
```
CREATE DATABASE orbital;
CREATE USER myuser WITH ENCRYPTED PASSWORD 'pass';
ALTER ROLE myuser SET client_encoding TO 'utf8';
 ALTER ROLE myuser SET default_transaction_isolation TO 'read committed';
 ALTER ROLE myuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE orbital TO myuser;
\c orbital
GRANT ALL ON SCHEMA public TO myuser;
```

7. **Apply Migrations**
```   
python manage.py migrate
```
8. **Run the Backend Server**
```
uvicorn backend.asgi:application
```
### Setting up the Frontend

1. **Install frontend dependencies**
```
cd .\frontend\ (if in root folder)
npm install
```
2. **Run the frontend server**
```   
npm run dev
```
3. **Open the App in Your Browser**
    
Visit http://localhost:5173 to start using the application.
