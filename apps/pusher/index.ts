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
  console.log(website.length)
  await xBulk(
    website.map((w) => ({
      url: w.url,
      id: w.id,
    }))
  );


  setInterval(() => {
    main()
  }, 3 * 1000 * 60)
}

main()
