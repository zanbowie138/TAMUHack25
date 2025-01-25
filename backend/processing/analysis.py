from openai import OpenAI
from dotenv import load_dotenv

def analyze_sentiment(prompt):
    load_dotenv() # Make sure to have a .env file with OPENAI_API_KEY
    client = OpenAI()

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Say this is a test",
            }
        ],
        model="gpt-4o",
    )

    print(chat_completion.choices[0].message.content)