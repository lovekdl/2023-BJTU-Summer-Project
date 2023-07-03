from collections.abc import Callable, Iterable, Mapping
from typing import Any
from django.apps import apps

import threading
import time

class GameLoopThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.setDaemon(True) # 可以被Ctrl+C关闭
        self.stop_event = threading.Event()

    def run(self):
        time.sleep(3)

        Player = apps.get_model(app_label='main', model_name='Player')

        while not self.stop_event.is_set():
            players = Player.objects.all()
            for player in players:
                player.refresh_resource()
            
            # print("A loop ends.")
            time.sleep(1)
    
    def stop(self):
        self.stop_event.set()
