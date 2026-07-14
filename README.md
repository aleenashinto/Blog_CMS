 Blog CMS – Django + React

A full-stack Blog Content Management System built with:

- **Backend:** Django + Django REST Framework + MySQL
- **Frontend:** React + Vite + Bootstrap
- **Authentication:** JWT (JSON Web Tokens)
- **Features:** Create, Read, Update, Delete posts, Categories, Tags, Comments, Search, Rich Text Editor

## Live Demo
- Frontend: [https://your-app.vercel.app](https://your-app.vercel.app)
- Backend API: [https://yourusername.pythonanywhere.com](https://yourusername.pythonanywhere.com)

## Installation

```bash
# Clone the repository
git clone https://github.com/aleenashinto/Blog_CMS.git

# Backend setup
cd Blog_CMS/backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Frontend setup
cd ../frontend
npm install
npm run dev
