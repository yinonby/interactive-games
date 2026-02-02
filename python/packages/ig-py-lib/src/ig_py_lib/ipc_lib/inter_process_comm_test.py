import pytest
from ig_py_lib import InterProcessComm


@pytest.mark.asyncio
async def test_subscribe_and_publish() -> None:
    ipc = InterProcessComm()

    # Subscribe queues to topic
    ipc_queue_1 = ipc.subscribe("topic1")
    ipc_queue_2 = ipc.subscribe("topic1")

    # Publish a message
    await ipc.publish("topic1", "hello")

    # Check that both queues received the message
    assert await ipc_queue_1.get() == "hello"
    assert await ipc_queue_2.get() == "hello"


@pytest.mark.asyncio
async def test_unsubscribe() -> None:
    ipc = InterProcessComm()

    ipc_queue = ipc.subscribe("topic1")

    # Unsubscribe and publish
    ipc.unsubscribe("topic1", ipc_queue)
    await ipc.publish("topic1", "message after unsubscribe")

    # Queue should remain empty
    assert ipc_queue.empty()


@pytest.mark.asyncio
async def test_publish_to_empty_topic() -> None:
    ipc = InterProcessComm()

    # Publishing to a topic with no subscribers should not fail
    await ipc.publish("nonexistent_topic", "some message")  # should not raise
