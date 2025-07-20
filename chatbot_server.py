from flask import Flask, request, jsonify

app = Flask(__name__)

# Đã xóa code bot cũ, giữ lại bot mới sử dụng Botpress trên web
# File này hiện không còn code bot nội bộ, chỉ dùng Botpress embed trên website

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_msg = data.get('text', '')
    # Gọi đến Botpress API để lấy phản hồi từ bot mới
    bot_response = call_botpress_api(user_msg)
    return jsonify({'reply': bot_response})

def call_botpress_api(message):
    # Hàm này sẽ gọi đến Botpress API và trả về phản hồi từ bot
    # Thay thế đoạn code này bằng code thực tế để gọi đến Botpress
    return "Đây là phản hồi từ Botpress: " + message

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
