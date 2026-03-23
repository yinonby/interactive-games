import json
from collections import defaultdict
from typing import Any, Dict, Set

from fastapi import WebSocket

from ig_py_lib.log_lib.logger import PyLogger


class WsSubscriptionManager:
    def __init__(self) -> None:
        self.topic_subscribers: Dict[str, Set[WebSocket]] = defaultdict(set)
        self.client_subscriptions: Dict[WebSocket, Set[str]] = defaultdict(set)
        self.logger: PyLogger = PyLogger()

    def subscribe(self, ws: WebSocket, topic: str) -> None:
        self.topic_subscribers[topic].add(ws)
        self.client_subscriptions[ws].add(topic)

    def unsubscribe(self, ws: WebSocket, topic: str) -> None:
        self.topic_subscribers[topic].discard(ws)
        self.client_subscriptions[ws].discard(topic)

        if not self.topic_subscribers[topic]:
            del self.topic_subscribers[topic]

    def cleanup(self, ws: WebSocket) -> None:
        topics = self.client_subscriptions.pop(ws, set())
        for topic in topics:
            self.topic_subscribers[topic].discard(ws)
            if not self.topic_subscribers[topic]:
                del self.topic_subscribers[topic]

    async def broadcast(self, topic: str, message: dict[str, Any]) -> None:
        if topic not in self.topic_subscribers:
            return

        message_str = json.dumps(message)
        dead_clients = []

        for ws in self.topic_subscribers[topic]:
            self.logger.debug(
                f"Websocket Subscribers: Sending to client, topic {topic}, message_str [{message_str}]"
            )
            try:
                await ws.send_text(message_str)
            except Exception:
                dead_clients.append(ws)

        for ws in dead_clients:
            self.cleanup(ws)
