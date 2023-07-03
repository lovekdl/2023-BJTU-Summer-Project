# Made by YXH_XianYu
#      in 2023.5.9
#      for Worldline Project

from .chatgpt import ChatGPT

# McllmBackend
# Flask与LLM的中间层
class McllmBackend():
    HISTORY_LENGTH_LIMIT = 20
    def __init__(self):
        self.histories = {}
        self.chatgpt = ChatGPT()

    def query(self, username, target, message):
        # 1. get key
        # key = username + "#" + target
        key = target
        if not key in self.histories:
            self.histories[key] = []
        
        # 2. query
        response = self.chatgpt.query(self.histories[key], username, target, message)
        
        if response is None:
            return None

        # 3. clear history
        if len(self.histories[key]) > McllmBackend.HISTORY_LENGTH_LIMIT:
            self.histories[key].pop(0)
        
        # 4. output
        return response

    def reset(self):
        self.histories = {}
