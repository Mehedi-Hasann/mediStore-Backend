

import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.PORT || 5000

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connection successfully");

    app.listen(PORT,()=>{
      console.log(`Server is running on http://localhost:${PORT}`);
    })

  } catch (error) {
    console.log("error => ",error);
    await prisma.$disconnect();
    process.exit(1)
  }
}



main()