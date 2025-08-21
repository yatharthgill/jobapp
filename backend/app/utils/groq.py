from groq import AsyncGroq
from app.core.settings import settings

# Initialize async Groq client
client = AsyncGroq(api_key=settings.GROQ_API_KEY)


async def get_groq_response(user_message: str) -> str:
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You're a helpful fitness assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"⚠️ Error: {str(e)}"
