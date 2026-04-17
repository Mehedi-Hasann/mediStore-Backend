import app from "./app";
import { envVars } from "./config/env";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    
    await prisma.$connect();
    console.log("Database connection successfully");

    app.listen(envVars.PORT,()=>{
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    })

  } catch (error) {
    console.log("error => ",error);
    await prisma.$disconnect();
    process.exit(1)
  }
}



main()