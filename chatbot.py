import google.generativeai as genai

# Cấu hình API key cho Gemini
genai.configure(api_key="AIzaSyBOIz1Yt5IDODA_U8sB1TvB5IusHnLxXZo")

def get_embedding(text):
    result = genai.embed_content(
        model="models/embedding-001",
        content=text,
        task_type="retrieval_document"
    )
    return result["embedding"]

if __name__ == "__main__":
    email_content = input("Nhập nội dung email cần lấy embedding: ")
    embedding = get_embedding(email_content)
    print("Embedding:", embedding)
