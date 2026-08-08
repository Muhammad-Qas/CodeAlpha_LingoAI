import os
import requests

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

load_dotenv()

app = Flask(__name__, static_folder="../frontend", static_url_path="")
CORS(app)

AZURE_TRANSLATOR_KEY = os.getenv("AZURE_TRANSLATOR_KEY")
AZURE_TRANSLATOR_REGION = os.getenv("AZURE_TRANSLATOR_REGION")

if not AZURE_TRANSLATOR_KEY:
    raise RuntimeError("AZURE_TRANSLATOR_KEY is missing from the .env file")

if not AZURE_TRANSLATOR_REGION:
    raise RuntimeError("AZURE_TRANSLATOR_REGION is missing from the .env file")


AZURE_TRANSLATOR_URL = (
    "https://api.cognitive.microsofttranslator.com/translate"
)


@app.route("/", methods=["GET"])
def serve_frontend():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/translate", methods=["POST"])
def translate():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Request body is required"
            }), 400

        text = data.get("text", "").strip()
        source = data.get("source", "auto")
        target = data.get("target", "")

        if not text:
            return jsonify({
                "error": "Text is required"
            }), 400

        if not target:
            return jsonify({
                "error": "Target language is required"
            }), 400

        if len(text) > 5000:
            return jsonify({
                "error": "Text cannot exceed 5000 characters"
            }), 400

        params = {
            "api-version": "3.0",
            "to": target.lower()
        }

        if source and source.lower() != "auto":
            params["from"] = source.lower()

        headers = {
            "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY,
            "Ocp-Apim-Subscription-Region": AZURE_TRANSLATOR_REGION,
            "Content-Type": "application/json"
        }

        body = [
            {
                "text": text
            }
        ]

        response = requests.post(
            AZURE_TRANSLATOR_URL,
            params=params,
            headers=headers,
            json=body,
            timeout=30
        )

        if response.status_code != 200:
            return jsonify({
                "error": "Azure Translator request failed",
                "details": response.text
            }), response.status_code

        result = response.json()

        translation = result[0]["translations"][0]["text"]

        detected_language = None

        if "detectedLanguage" in result[0]:
            detected_language = result[0]["detectedLanguage"].get(
                "language"
            )

        return jsonify({
            "translation": translation,
            "source": detected_language or source,
            "target": target
        })

    except requests.exceptions.Timeout:
        return jsonify({
            "error": "Azure Translator request timed out. Please try again."
        }), 504

    except requests.exceptions.RequestException as error:
        return jsonify({
            "error": f"Unable to connect to Azure Translator: {str(error)}"
        }), 502

    except Exception as error:
        return jsonify({
            "error": f"Server error: {str(error)}"
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )