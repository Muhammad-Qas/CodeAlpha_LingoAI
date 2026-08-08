# \# LingoAI — AI Language Translation Web App

# 

# \*\*CodeAlpha Artificial Intelligence Internship — Task 1\*\*

# 

# LingoAI is a modern, responsive language translation web application built to fulfill \*\*CodeAlpha's Task 1: Language Translation Tool\*\*.

# 

# Users can enter text, select a source and target language, and receive a translated result through \*\*Microsoft Azure Translator\*\*. The frontend communicates with a separate \*\*Flask backend\*\*, keeping translation credentials securely on the server instead of exposing them in the browser.

# 

# \---

# 

# \## 📸 Screenshots

# 

# \### 🏠 Home Page

# 

# !\[LingoAI Home Page](../screenshots/Home-page.png)

# 

# \### 🌐 Translator

# 

# !\[LingoAI Translator](../screenshots/Translator.png)

# 

# \### 🗣️ Supported Languages

# 

# !\[LingoAI Languages](../screenshots/Languages.png)

# 

# \### ⚡ Features

# 

# !\[LingoAI Features](../screenshots/Features.png)





# \---

# 

# \## 🎯 Project Purpose

# 

# This project fulfills the CodeAlpha Task 1 requirements:

# 

# \* A user interface for entering text.

# \* Source and target language selection.

# \* Auto-detection of the source language.

# \* Translation through Microsoft Azure Translator.

# \* Clear display of the translated result.

# \* Copy-to-clipboard functionality.

# \* Plain-text download functionality.

# \* Responsive and accessible user experience.

# \* A separate Flask backend that handles communication with the translation service.

# 

# The frontend does \*\*not\*\* contain translation logic or Azure credentials. It communicates only with the Flask `/api/translate` endpoint.

# 

# \---

# 

# \## ✨ Features

# 

# \### Translation

# 

# \* Microsoft Azure Translator integration.

# \* Auto Detect source language.

# \* 15 supported languages.

# \* Source and target language selection.

# \* One-click language swapping.

# \* Automatically swaps the text when a previous translation exists.

# \* Maximum input length of \*\*5,000 characters\*\*.

# \* Live character counter.

# \* Loading state while translation is processing.

# \* Friendly validation and error messages.

# \* Displays the detected source language when Auto Detect is used.

# 

# \### Translation Actions

# 

# \* \*\*Clear\*\* — removes the source text.

# \* \*\*Copy\*\* — copies the translated result to the clipboard.

# \* \*\*Download\*\* — downloads the translation as `lingoai-translation.txt`.

# 

# \### User Experience

# 

# \* Fully responsive design.

# \* Desktop, tablet, and mobile support.

# \* Mobile navigation menu.

# \* Keyboard shortcut: \*\*Ctrl + Enter\*\* to translate.

# \* Semantic form controls.

# \* Visible focus states.

# \* `aria-live` translation status.

# \* Reduced-motion support.

# \* Scroll-based section reveal animations.

# \* Clean SaaS-style interface with custom inline SVG icons.

# 

# \---

# 

# \## 🌍 Supported Languages

# 

# LingoAI currently supports:

# 

# | Code | Language   |

# | ---- | ---------- |

# | `en` | English    |

# | `ur` | Urdu       |

# | `hi` | Hindi      |

# | `de` | German     |

# | `fr` | French     |

# | `es` | Spanish    |

# | `it` | Italian    |

# | `pt` | Portuguese |

# | `nl` | Dutch      |

# | `pl` | Polish     |

# | `ru` | Russian    |

# | `ja` | Japanese   |

# | `zh` | Chinese    |

# | `ko` | Korean     |

# | `tr` | Turkish    |

# 

# The source language additionally supports \*\*Auto Detect\*\*.

# 

# \---

# 

# \## 🛠️ Technology Stack

# 

# \### Frontend

# 

# \* HTML5

# \* CSS3

# \* Vanilla JavaScript

# \* CSS Grid \& Flexbox

# \* Custom CSS properties

# \* JavaScript `fetch()` API

# \* ES2017+ / `async` \& `await`

# \* Inline SVG icons

# \* No frontend framework or build system required

# 

# \### Backend

# 

# \* Python

# \* Flask

# \* Flask-CORS

# \* Requests

# \* python-dotenv

# 

# \### Translation Service

# 

# \* Microsoft Azure Translator

# 

# \### Frameworks/Libraries Not Used

# 

# This project does not use:

# 

# \* React

# \* Vue

# \* Angular

# \* Bootstrap

# \* Tailwind CSS

# \* jQuery

# \* Icon libraries

# 

# \---

# 

# \## 📁 Project Structure

# 

# ```text

# LingoAI-Web/

# │

# ├── frontend/

# │   ├── index.html          # Landing page and translator interface

# │   ├── style.css           # Complete visual design and responsive layout

# │   ├── script.js           # Frontend interaction and API communication

# │   └── README.md           # Frontend documentation

# │

# └── backend/

# &#x20;   ├── app.py              # Flask API and Azure Translator integration

# &#x20;   ├── requirements.txt    # Python dependencies

# &#x20;   ├── .env                # Local environment variables — not committed

# &#x20;   └── .env.example        # Example environment configuration

# ```

# 

# > `backend/.env` should contain your private Azure credentials and must never be committed to GitHub.

# 

# \---

# 

# \## 🔄 How LingoAI Works

# 

# The application follows a simple client-server architecture:

# 

# ```text

# User

# &#x20; │

# &#x20; ▼

# LingoAI Frontend

# (HTML + CSS + JavaScript)

# &#x20; │

# &#x20; │ POST /api/translate

# &#x20; ▼

# Flask Backend

# (Python)

# &#x20; │

# &#x20; │ Authenticated API request

# &#x20; ▼

# Microsoft Azure Translator

# &#x20; │

# &#x20; │ Translation response

# &#x20; ▼

# Flask Backend

# &#x20; │

# &#x20; │ JSON response

# &#x20; ▼

# LingoAI Frontend

# &#x20; │

# &#x20; ▼

# Translated Result

# ```

# 

# \### Request Flow

# 

# 1\. The user enters text.

# 2\. The user selects the source and target languages.

# 3\. JavaScript validates the input.

# 4\. The frontend sends a `POST` request to `/api/translate`.

# 5\. Flask receives the request.

# 6\. Flask securely attaches the Azure Translator credentials.

# 7\. Azure Translator processes the text.

# 8\. Flask returns the translation to the frontend.

# 9\. JavaScript displays the translated result.

# 

# \---

# 

# \## 🔌 Frontend API Configuration

# 

# The frontend communicates with the Flask backend through:

# 

# ```javascript

# const API\_BASE\_URL = "http://127.0.0.1:5000";

# const TRANSLATE\_ENDPOINT = `${API\\\_BASE\\\_URL}/api/translate`;

# ```

# 

# The frontend does \*\*not\*\* communicate directly with Microsoft Azure Translator.

# 

# This architecture keeps Azure credentials on the backend.

# 

# \---

# 

# \## 🔐 Environment Variables

# 

# Azure credentials are stored only in:

# 

# ```text

# backend/.env

# ```

# 

# Example:

# 

# ```env

# AZURE\_TRANSLATOR\_KEY=your\_key\_here

# AZURE\_TRANSLATOR\_REGION=your\_region\_here

# ```

# 

# The project also includes:

# 

# ```text

# backend/.env.example

# ```

# 

# for documenting the required configuration without exposing real credentials.

# 

# \*\*Never commit your real `.env` file or Azure API key to GitHub.\*\*

# 

# \---

# 

# \## 🚀 Running Locally

# 

# \### 1. Clone the repository

# 

# ```bash

# git clone https://github.com/Muhammad-Qas/CodeAlpha\_LingoAI.git

# cd CodeAlpha\_LingoAI

# ```

# 

# \### 2. Configure the backend

# 

# Navigate to the backend:

# 

# ```bash

# cd backend

# ```

# 

# Create your `.env` file:

# 

# ```env

# AZURE\_TRANSLATOR\_KEY=your\_key\_here

# AZURE\_TRANSLATOR\_REGION=your\_region\_here

# ```

# 

# Install the required Python packages:

# 

# ```bash

# pip install -r requirements.txt

# ```

# 

# \### 3. Start Flask

# 

# From the `backend` directory:

# 

# ```bash

# python app.py

# ```

# 

# The backend runs by default at:

# 

# ```text

# http://127.0.0.1:5000

# ```

# 

# \### 4. Start the frontend

# 

# Open a second PowerShell window and navigate to:

# 

# ```text

# D:\\AI-ML-INTERNSHIP\\CodeAlpha\\LingoAI-Web\\frontend

# ```

# 

# You can serve the frontend with a simple local server:

# 

# ```bash

# python -m http.server 5500

# ```

# 

# Then open:

# 

# ```text

# http://127.0.0.1:5500

# ```

# 

# The frontend is configured to communicate with the Flask backend at:

# 

# ```text

# http://127.0.0.1:5000

# ```

# 

# \---

# 

# \## 📡 API Endpoint

# 

# \### `POST /api/translate`

# 

# \#### Request

# 

# ```json

# {

# &#x20; "text": "Hello, how are you?",

# &#x20; "source": "en",

# &#x20; "target": "ur"

# }

# ```

# 

# \#### Response

# 

# ```json

# {

# &#x20; "translation": "ہیلو، آپ کیسے ہیں؟",

# &#x20; "source": "en",

# &#x20; "target": "ur"

# }

# ```

# 

# \### Auto Detection

# 

# When the source language is set to Auto Detect:

# 

# ```json

# {

# &#x20; "text": "Hello, how are you?",

# &#x20; "source": "auto",

# &#x20; "target": "ur"

# }

# ```

# 

# The backend receives the request without a fixed source language and returns the detected language code.

# 

# The frontend then displays a message such as:

# 

# ```text

# Detected: English

# ```

# 

# \---

# 

# \## 🛡️ Security

# 

# LingoAI follows a server-side credential architecture.

# 

# \* Azure Translator credentials are stored in `backend/.env`.

# \* API keys are never placed in frontend JavaScript.

# \* The browser never communicates directly with Azure Translator.

# \* Flask handles authentication with Azure.

# \* The frontend communicates only with the Flask API.

# \* `.env` should remain excluded from version control.

# \* The application provides user-friendly error messages instead of exposing backend implementation details.

# 

# \### Important

# 

# This is an \*\*internship/portfolio demonstration project\*\*, not a production-ready translation platform.

# 

# It currently does not implement:

# 

# \* Authentication

# \* Rate limiting

# \* Translation history persistence

# \* Database storage

# \* Production monitoring

# 

# \---

# 

# \## ♿ Accessibility

# 

# The interface includes several accessibility considerations:

# 

# \* Semantic HTML controls.

# \* Visible keyboard focus states.

# \* Accessible navigation labels.

# \* `aria-live` translation status.

# \* `role="alert"` for error messages.

# \* Keyboard translation shortcut.

# \* Mobile-friendly navigation.

# \* `prefers-reduced-motion` support.

# \* Responsive layout across different screen sizes.

# 

# \---

# 

# \## 📱 Responsive Design

# 

# LingoAI is designed to work across:

# 

# \* Mobile phones

# \* Tablets

# \* Laptops

# \* Desktop screens

# 

# The interface adapts its layout using CSS Grid, Flexbox, responsive breakpoints, and mobile navigation.

# 

# \---

# 

# \## 🧩 How It Works

# 

# LingoAI follows three simple steps:

# 

# \### 01 — Enter Text

# 

# Type or paste up to \*\*5,000 characters\*\* into the source panel.

# 

# \### 02 — Choose Languages

# 

# Select a source language or use \*\*Auto Detect\*\*, then choose a target language.

# 

# \### 03 — Get Translation

# 

# Select \*\*Translate Now\*\* and receive the translated text through the Flask → Azure Translator pipeline.

# 

# The result can then be copied or downloaded as a plain-text file.

# 

# \---

# 

# \## 🔮 Future Improvements

# 

# Potential future enhancements include:

# 

# \* Translation history for the current session.

# \* Text-to-speech playback.

# \* Batch translation of multiple text blocks.

# \* Language suggestions based on browser locale.

# \* User accounts and persistent translation history.

# \* Additional translation providers as optional fallback services.

# \* Production deployment with authentication and rate limiting.

# 

# \---

# 

# \## 🎓 CodeAlpha Internship

# 

# This project was developed as part of the:

# 

# \*\*CodeAlpha Artificial Intelligence Internship — Task 1: Language Translation Tool\*\*

# 

# The objective was to create a functional language translation application with language selection, API-based translation, and a clear user interface.

# 

# \---

# 

# \## 👨‍💻 Author

# 

# \*\*Muhammad Qas\*\*

# 

# AI / Machine Learning Enthusiast • Full-Stack Developer

# 

# \---

# 

# \## 📄 License

# 

# This project was created for educational, internship, and portfolio purposes.

