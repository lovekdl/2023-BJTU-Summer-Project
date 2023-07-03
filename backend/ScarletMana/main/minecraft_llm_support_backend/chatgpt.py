# Made by YXH_XianYu
#      in 2023.5.9
#      for Worldline Project

import os # for environment variables
import openai
from .characters import Characters

class ChatGPT():
    CHATGPT_DEFAULT_PROMPT = [{"role": "system", "content": "You are a helpful assistant."}]

    def __init__(self):
        if "OPENAI_API_KEY" not in os.environ:
            print(" ===== ===== FATAL ERROR: Not set OPENAI_API_KEY ===== ===== ")
        else:
            openai.api_key = os.environ["OPENAI_API_KEY"] # my account
            print("Load OpenAIKey: " + openai.api_key)

    def query(self, history, username, target, message): # Only stores last 20 histories

        history.append({"role": "user", "name": username, "content": message})
        
        if Characters.exist(target):
            response = openai.ChatCompletion.create(
                model = "gpt-3.5-turbo",
                messages = Characters.getPrompt(target) + history
            )
        else:
            response = openai.ChatCompletion.create(
                model = "gpt-3.5-turbo",
                messages = ChatGPT.CHATGPT_DEFAULT_PROMPT + history
            )

        response = response["choices"][0]["message"]
        
        history.append(response)

        return response["content"]
