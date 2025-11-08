import axios from "axios";
import { xAckBulk, xReadGroup, createConsumerGroup } from "redisstream/client";
import { prismaClient } from "store/client";

const REGIONS = ["india", "usa"];
const WORKER_ID = "worker1";

async function startWorker(regionId: string) {
  console.log(`Starting worker for region: ${regionId}`);
  
  await createConsumerGroup(regionId);
  
  while (1) {
    const response = await xReadGroup(regionId, WORKER_ID);

    if (!response) {
      continue;
    }

    let promises = response.map(({message}: any) => fetchWebsite(message.url, message.id, regionId))

    await Promise.all(promises);
    console.log(`${regionId}: Processed ${promises.length} websites`)

    await xAckBulk(regionId, response.map(({id}: any) => id))
  }
}

async function fetchWebsite(url: string, websiteId: string, regionId: string) {
    const startTime = Date.now();

    try {
        await axios.get(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`✓ ${regionId} - ${url}: ${responseTime}ms (UP)`);
        await prismaClient.website_tick.create({
            data: {
                response_time_ms: responseTime,
                status: "up",
                region_id: regionId,
                website_id: websiteId
            }
        })
    } catch {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`✗ ${regionId} - ${url}: ${responseTime}ms (DOWN)`);
        await prismaClient.website_tick.create({
            data: {
                response_time_ms: responseTime,
                status: "Down",
                region_id: regionId,
                website_id: websiteId
            }
        })
    }
}

REGIONS.forEach(region => startWorker(region));







