import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function seed() {
  const skupi = await prisma.user.create({
    data: {
      username: "skupi",
      passwordHash:
        "$2a$10$Y5BSGwaJbWilbtrvct3uNexgs3lA0BKic7.jEN2ndUkBCw/NQApRW",
    },
  })

  await Promise.all(
    getPosts().map((post) => {
      const data = { userId: skupi.id, ...post }
      return prisma.post.create({ data })
    })
  )
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

function getPosts() {
  return [
    {
      title: "JavaScript Performance Tips",
      body: `We will look at 10 simple tips and tricks to increase the speed of your code when writing JS`,
    },
    {
      title: "Tailwind vs. Bootstrap",
      body: `Both Tailwind and Bootstrap are very popular CSS frameworks. In this article, we will compare them`,
    },
    {
      title: "Writing Great Unit Tests",
      body: `We will look at 10 simple tips and tricks on writing unit tests in JavaScript`,
    },
    {
      title: "What Is New In PHP 8?",
      body: `In this article we will look at some of the new features offered in version 8 of PHP`,
    },
  ]
}
