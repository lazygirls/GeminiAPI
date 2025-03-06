from google import genai

# Khởi tạo client với khóa API của bạn
client = genai.Client(api_key="YOUR_API_KEY")

# Chọn mô hình Gemini bạn muốn sử dụng
model = "gemini-2.0-flash"

# Hàm để tạo yêu cầu và nhận phản hồi từ Gemini
def generate_response(prompt):
    response = client.models.generate_content(
        model=model,
        contents=prompt
    )
    return response.text

# Ví dụ sử dụng:
user_message = "Giải thích cách AI hoạt động"
gemini_response = generate_response(user_message)
print(gemini_response)