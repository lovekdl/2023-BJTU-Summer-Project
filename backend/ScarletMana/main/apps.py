from typing import Any, Optional
from django.apps import AppConfig

import os
import threading
import signal
import sys

from .game_loop import GameLoopThread

# For OpenAI/ChatGPT
# os.environ['http_proxy'] = "http://127.0.0.1:20171"
# os.environ['https_proxy'] = "http://127.0.0.1:20171"

class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self) -> None:
        # print("READY", id(self))
        self.game_loop = GameLoopThread()
        self.game_loop.start()
        # 在Ctrl C时同时关闭线程
        signal.signal(signal.SIGINT, self.stop_game_handler)
    
    def stop_game_handler(self, signum, frame):
        # print("stop game!")
        self.game_loop.stop()
        sys.exit(0)
