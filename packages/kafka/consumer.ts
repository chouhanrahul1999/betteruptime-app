
import type { Consumer, EachMessagePayload } from "kafkajs";
import kafka from "./client";

export class KafkaConsumer {
    private consumer: Consumer;
    private topics: string[];
    private groupId: string;

    constructor(groupId: string, topics: string[]) {
        this.groupId = groupId;
        this.consumer = kafka.consumer({ groupId });
        this.topics = topics;
    }

    async start(handler: (message: any) => 
        Promise<void>) {
            await this.consumer.connect();
            console.log(`Consumer connected (group: ${this.groupId})`);

            await this.consumer.subscribe({
                topics: this.topics,
                fromBeginning: false,
            });

            await this.consumer.run({
                eachMessage: async({ topic, partition, message }: EachMessagePayload) => {
                    try {
                        const event = JSON.parse(message.value?.toString() || '{}');
                        console.log(`✓ Received event from ${topic}:`, event.type);
                        await handler(event);
                    } catch (err) {
                        console.error('✗ Error processing message:', err);
                    }
                }
            })
        }

        async stop() {
            await this.consumer.disconnect();
        }
}