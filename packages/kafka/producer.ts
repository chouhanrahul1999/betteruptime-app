import kafka from "./client";

const producer = kafka.producer();

let isConnected = false;

export async function connectProducer() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("✓ Kafka Producer connected");
  }
}

export async function publishEvent(topic: string, event: any) {
  try {
    await connectProducer();
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
        },
      ],
    });
    console.log(`✓ Event published to ${topic}:`, event.type);
  } catch (err) {
    console.error("✗ Failed to publish event:", err);
    throw err;
  }
}

export async function disconnectProducer() {
    if (isConnected) {
        await producer.disconnect();
        isConnected = false
    }
}
