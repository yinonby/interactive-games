import asyncio
from collections import defaultdict
from typing import Generic, TypeVar

T = TypeVar("T")  # T can represent any type


class InterProcessComm(Generic[T]):
    def __init__(self) -> None:
        self.subscribers: dict[str, set[asyncio.Queue[T]]] = defaultdict(set)

    def subscribe(self, ipcTopic: str) -> asyncio.Queue[T]:
        ipc_queue = asyncio.Queue[T]()
        self.subscribers[ipcTopic].add(ipc_queue)
        return ipc_queue

    def unsubscribe(self, ipcTopic: str, ipc_queue: asyncio.Queue[T]) -> None:
        self.subscribers[ipcTopic].discard(ipc_queue)

    async def publish(self, ipcTopic: str, message: T) -> None:
        for ipc_queue in self.subscribers[ipcTopic]:
            await ipc_queue.put(message)
