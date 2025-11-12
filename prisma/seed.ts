/* eslint-disable @typescript-eslint/no-var-requires */
const { Events, PrismaClient } = require('../node_modules/.prisma/client');

const prisma = new PrismaClient();

const seedEvent = async (
  name: string,
  totalSeats: number,
): Promise<typeof Events> => {
  console.log('Seeding event', { name, totalSeats });
  const record = await prisma.events.create({
    data: {
      name,
      total_seats: totalSeats,
    },
  });
  console.log(`Event seeded successfully`, { record });
  return record;
};

async function main() {
  await seedEvent('Event 1', 5);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
