from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import requests

# Cấu hình API key cho Gemini
genai.configure(api_key="AIzaSyBOIz1Yt5IDODA_U8sB1TvB5IusHnLxXZo")

app = Flask(__name__)
CORS(app)

# Route kiểm tra server sống
@app.route('/')
def home():
    return 'Gemini Embedding API is running!'


# API trả về embedding (giữ nguyên)
@app.route('/embedding', methods=['POST'])
def embedding_api():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    try:
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        return jsonify({'embedding': result["embedding"]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# API trả về hội thoại Gemini 2.0 Flash qua HTTP
@app.route('/chat', methods=['POST'])
def chat_api():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    try:
        api_key = "AIzaSyBOIz1Yt5IDODA_U8sB1TvB5IusHnLxXZo"  # Hoặc lấy từ biến môi trường
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
        payload = {
            "contents": [
                {"parts": [{"text": text}]}
            ]
        }
        headers = {"Content-Type": "application/json"}
        resp = requests.post(url, json=payload, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            reply = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "Không có trả lời.")
            return jsonify({"reply": reply})
        else:
            return jsonify({"error": f"Gemini API error: {resp.status_code} {resp.text}"}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)