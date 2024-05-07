## About

Lockness is a tool that helps researchers write queries more efficiently.

## Getting Started

### Running the frontend

1. Install the dependencies
```bash
cd frontend
npm install
```

2. Start the frontend
```bash
npm start
```

### Running the backend

1. Set up the virtual environment
```bash
cd backend
python3 -m venv venv
```

2. Activate the virtual environment
```bash
source venv/bin/activate
```

3. Install the dependencies
```bash
pip install -r requirements.txt
```

4. Start the backend
```bash
python app.py
```

### Starting the database

1. Install postgresql
```bash
brew install postgresql
```

2. Start the postgresql server
```bash
brew services start postgresql
```

3. Create the necessary db/user (run at db_url = 'postgresql://postgres:{password}@localhost/lockness')
```bash
psql postgres
CREATE DATABASE lockness;
CREATE USER lockness WITH PASSWORD '{password}';
```

## Deployment

### Frontend

Deploy the frontend to Vercel
```bash
cd frontend
```

```bash
vercel --prod   
```

### Backend

Deploy the backend to Heroku
```bash
git subtree push --prefix backend heroku main 
```

## Contributing

For all major features, create a new feature branch. When finished testing, merge into the `main` branch.


