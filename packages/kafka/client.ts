import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'uptime-monitor',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    retry: {
        initialRetryTime: 300,
        retries: 10,
        maxRetryTime: 30000,
        restartOnFailure: async () => true
    },
    connectionTimeout: 10000,
    requestTimeout: 30000
})

export default kafka;