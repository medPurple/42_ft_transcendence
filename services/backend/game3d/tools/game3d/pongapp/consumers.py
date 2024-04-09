import json

from channels.generic.websocket import WebsocketConsumer

class PongConsumer(WebsocketConsumer):
    def connect(self):
        async_to_sync(self.channel_layer.group_add("test", self.channel_name))
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)("test", self.channel_name)
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        paddle = text_data_json["paddle"]

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "paddle_message", "paddle": paddle}
        )

    def paddle_message(self, event):
