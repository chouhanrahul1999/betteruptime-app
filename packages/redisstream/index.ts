import { createClient } from "redis";

const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

type WebsiteEvent = {
  url: string;
  id: string;
};

type MessageType = {
  id: string;
  message: {
    url: string;
    id: string;
  };
};

const STREAM_NAME = "betteruptime:website";

export async function xAdd({ url, id }: WebsiteEvent) {
  await client.xAdd(STREAM_NAME, "*", {
    url,
    id,
  });
}

export async function xBulk(website: WebsiteEvent[]) {
  for (let i = 0; i < website.length; i++) {
    await xAdd({
      url: website[i]?.url!,
      id: website[i]?.id!,
    });
  }
}

export async function xReadGroup(consumerGroup: string, workerId: string) {
  const res = await client.xReadGroup(
    consumerGroup,
    workerId,
    {
      key: STREAM_NAME,
      id: ">",
    },
    {
      COUNT: 5,
    }
  );

  return (res as any)?.[0]?.messages;
}

export async function xAck(consumerGroup: string, eventId: string) {
  await client.xAck(STREAM_NAME, consumerGroup, eventId);
}

export async function xAckBulk(consumerGroup: string, eventIds: string[]) {
  await Promise.all(eventIds.map((eventId) => xAck(consumerGroup, eventId)));
}
