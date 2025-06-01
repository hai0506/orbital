# Project Vendor
A web-based site built using Django for the backend and React for the frontend. This project was created as part of NUS' Orbital Apollo 11 program. 
This project aims to make the process of scouting for vendors for fundraisers more smooth. Additionally it also aims to double up as an inventory management system during fundraisers.

## Motivation 
There are many CCAs and societies in NUS that hold fundraisers to raise money for their CCAs, projects and causes. Oftentimes, they call down small local vendors to sell their items. The relationship between these two parties are symbiotic as these NUS based CCAs offer the vendors a chance to sell their items while the vendors help the students to raise money. However, there seems to be a lack of a centralised platform for both parties to connect with one another as they are unaware of each other’s existence. As a result, these student groups often spam many of these vendors DMs on social media platforms. With a more centralised platform like ours, they could essentially save the time spent chasing these vendors.  During the fundraisers, inventory management and revenue sharing becomes a very tricky affair. Whilst excel sheets can be used, nothing beats a human-friendly UI that is also able to automate some transactions. 

## User Stories 
- As a student group who wants to attract vendors for their fundraisers, they will be able to post descriptions of their upcoming fundraisers or accept the requests of vendors seeking to sell items.
- As a vendor who wants to have a crowd to sell to, they will be able to request for a job or accept the request for vendors for a fundraiser hosted by a student group
- As an outsider who might want to buy an item, they will be able to purchase the items directly off the site through a fast checkout.

## Uniqueness of our app
There are many apps out there that aim to bring buyers and sellers together such as Carousell and Ebay. However, these apps target one-off transactions. More importantly, this app hopes to bring (student) organizations and small vendors together, both of whom lack the clout and resources to seek opportunities for themselves. The app also aims to double up as an inventory management system during the fundraisers themselves.

## Features
- (Student) organizers can put up a listing for their upcoming fundraisers
- Likewise, vendors can also put up a listing requesting for work
- The organizations and vendors can negotiate the job offer and sign the contract over the platform
- Vendors can upload their inventory list onto the platform
- Reviewing and matching system

## Getting Started
Follow the steps below to get this project running on your local machine.

### Prerequisites
- Python 3.6+
- pip
- Node.js v14+
- npm or yarn
- Git
- A web browser

### Setting up the Backend

1. **Clone the Repository**
   
git clone https://github.com/hai0506/orbital.git

cd orbital

2. **Create a Virtual Environment**

cd .\backend\
python -m venv env

3. **Activate the Virtual Environment**
   
On macOS/Linux:

source env/bin/activate

On Windows:

env\Scripts\activate

4. **Install Dependencies**
   
pip install -r requirements.txt

5. **Apply Migrations**
   
python manage.py migrate

6. **Run the Backend Server**
   
python manage.py runserver

### Setting up the Frontend

1. **Install frontend dependencies**

cd .\frontend\ (if in root folder)
npm install

2. **Run the frontend server**
   
npm run dev

3. **Open the App in Your Browser**
    
Visit http://localhost:5173 to start using the application.
