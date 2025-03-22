# 📰 VeritasNews Project

This project processes news articles using AI (Gemini), saves summarized and categorized results, and sends them to a Django backend. The frontend displays this processed data.

---

## 🧰 Requirements

- Python 3.9+
- Node.js & npm
- Django
- Google Generative AI API Key (Gemini)
- Expo CLI (for React Native frontend)
- Required Python packages (`requirements.txt`)

---

## 🔧 1. Backend Setup (Django)

### 1.1 Install Dependencies

```bash
cd backend  # Navigate to your Django project directory
pip install -r requirements.txt
```

### 1.2 Update Backend Settings

Open your Django project and locate the file:  
`views/articleViews.py`

Update the path for the generated articles directory to match your system:

```python
GENERATED_ARTICLES_DIR = r"C:\Users\<your-username>\Desktop\bitirme\VeritasNews\News-Objectify\objectified_jsons"
```

Also, if you are using API keys or paths elsewhere in settings or views, make sure they are updated to reflect **your environment**.

> 💡 You may consider moving such variables into `settings.py` or using environment variables for better scalability and security.

### 1.3 Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 1.4 Start Django Server

```bash
python manage.py runserver
```

> Make sure the server runs at `http://127.0.0.1:8000`. If not, update URLs in the Python script accordingly.

---

## 🧠 2. AI-Powered Python Script Setup

### 2.1 Update Paths in the Script

In your script (e.g., `newsObjective.py`), update these variables to match your system:

```python
BASE_DIR = r"C:\Users\<your-username>\Desktop\bitirme\VeritasNews\News-Objectify\articles"
OUTPUT_DIR = r"C:\Users\<your-username>\Desktop\bitirme\VeritasNews\News-Objectify\objectified_jsons"
CONFIG_FILE = "./config.json"
JSON_DIR = OUTPUT_DIR  # If not already defined
```

### 2.2 Add Gemini API Key

Create a file named `config.json` in the same folder as the script with the following content:

```json
{
  "api_key": "your-gemini-api-key"
}
```

### 2.3 Install Python Dependencies

```bash
pip install google-generativeai requests
```

Or install everything from requirements:

```bash
pip install -r requirements.txt
```

### 2.4 Run the Script

```bash
python newsObjective.py
```

This will:

- Read matched article JSONs from `MatchedNewsData-*` folders
- Use Gemini AI to generate summaries, titles, and categories
- Save results to the `objectified_jsons` folder
- Send them to the Django backend

---

## 🌐 3. Frontend Setup

### 3.1 Navigate to Frontend Directory

```bash
cd frontend  # Replace with your actual frontend folder path
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Start the Frontend

#### Option A: React Native (Expo)

```bash
npx expo start
```

#### Option B: Web App (React)

```bash
npm start
```

> Ensure the frontend is configured to use the backend at `http://127.0.0.1:8000`.

---

## ✅ Final Notes

- 🟢 Run the **Django backend** first
- ⚙️ Then run the **Python script** to process & upload data
- 💻 Finally, run the **frontend** to view the processed content
- 🔁 You can re-run the script anytime new articles are added

---
