import "dotenv/config";
import { xBulk } from "redisstream/client";
import { prismaClient } from "store/client";

async function main() {
  let website = await prismaClient.website.findMany({
    select: {
      url: true,
      id: true,
    },
  });
  console.log(website.length);
  await xBulk(
    website.map((w) => ({
      url: w.url,
      id: w.id,
    }))
  );
}

main();
setInterval(main, 3 * 60 * 1000);
