import kafka from "./client";

let producer: any = null;
let isConnected = false;
let connectionPromise: Promise<void> | null = null;

export async function connectProducer() {
  if (isConnected) return;
  
  if (connectionPromise) {
    await connectionPromise;
    return;
  }
  
  connectionPromise = (async () => {
    if (!producer) {
      producer = kafka.producer();
    }
    if (!isConnected) {
      await producer.connect();
      isConnected = true;
      console.log("✓ Kafka Producer connected");
    }
  })();
  
  await connectionPromise;
  connectionPromise = null;
}

export async function publishEvent(topic: string, event: any) {
  console.log(`📝 Event: ${topic} - ${event.type}`);
  
  // Direct notification for DOWN events
  if (event.type === 'website.down') {
    await sendDownNotification(event);
  }
}

async function sendDownNotification(event: any) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'website_down',
        websiteId: event.websiteId,
        url: event.url,
        region: event.region,
        timestamp: event.timestamp
      })
    });
    
    if (response.ok) {
      console.log('✓ Down notification sent');
    }
  } catch (error) {
    console.error('✗ Failed to send notification:', error);
  }
}

export async function disconnectProducer() {
  if (isConnected && producer) {
    await producer.disconnect();
    isConnected = false;
    producer = null;
  }
}
