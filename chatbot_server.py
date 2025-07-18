# Free AI Chatbot with Python (Flask + ChatterBot)
# Install: pip install flask chatterbot chatterbot_corpus

from flask import Flask, request, jsonify
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

app = Flask(__name__)

chatbot = ChatBot('FreeBot', logic_adapters=[
    'chatterbot.logic.BestMatch'
])
trainer = ChatterBotCorpusTrainer(chatbot)
trainer.train('chatterbot.corpus.english')  # Bạn có thể thêm corpus tiếng Việt nếu muốn

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_msg = data.get('text', '')
    bot_response = str(chatbot.get_response(user_msg))
    return jsonify({'reply': bot_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
