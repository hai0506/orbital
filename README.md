# Project Vendor
A web-based site built using Django for the backend and React for the frontend. This project was created as part of NUS' Orbital Apollo 11 program. 
This project aims to make the process of scouting for vendors for fundraisers more smooth. Additionally it also aims to double up as an inventory management system during fundraisers.

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
