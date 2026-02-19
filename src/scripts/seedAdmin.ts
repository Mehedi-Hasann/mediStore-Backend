import { UserRole, UserStatus } from "../constants/enum";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required");
    }

    const adminData = {
      name : "Admin",
      email : adminEmail,
      role : UserRole.ADMIN,
      password : adminPassword,
      status : UserStatus.APPROVED
    };

    const isExist = await prisma.user.findUnique({
      where : {
        email : adminData.email
      }
    });
    if(isExist){
      throw new Error("Admin Already Exist.")
    };
    const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http:localhost:4000"
            },
            body: JSON.stringify(adminData)
    })
    // console.log(signUpAdmin.ok);
    if(signUpAdmin.ok){
      await prisma.user.update({
        where : {
          email : adminEmail
        },
        data : {
          emailVerified : true
        }
      })
    }
    console.log("Success to create the ADMIN");

  } catch (error) {
    console.log(error);
    throw error;
  }
}

seedAdmin();