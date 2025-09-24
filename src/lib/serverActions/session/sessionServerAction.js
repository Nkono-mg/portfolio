"use server";

import { User } from "@/app/models/User";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { Session } from "@/app/models/Session";
import { cookies } from "next/headers";

export async function userRegister(formDataUser) {
  const { userName, email, password, confirmPassword } =
    Object.fromEntries(formDataUser);
  if (userName.length < 3) {
    return { success: false, message: "Username is too short" };
  }
  if (password.length < 6) {
    return { success: false, message: "Password is too short" };
  }
  if (password !== confirmPassword) {
    return { success: false, message: "Password is not the same" };
  }
  try {
    await connectToDB();
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("Email already exist");
    }
    const normalizedUserName = slugify(userName, { lower: true, strict: true });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      userName,
      normalizedUserName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("User saved!");

    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(errorMessage);
  }
}
export async function loginUser(formDataUser) {
  /*const email = formDataUser.get("email");
  const password = formDataUser.get("password");*/
  const { email, password } = Object.fromEntries(formDataUser);
  try {
    await connectToDB();
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Email invalid" };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Password invalid" };
    }
    //creation de session, côté server
    let session = null;
    const existingSession = await Session.findOne({
      userId: user._id,
      expiresAt: { $gt: new Date() },
    });
    if (existingSession) {
      //session exist déjà
      session = existingSession;
      existingSession.expiresAt = new Dat(Date.now() + 1 * 24 * 60 * 1000);
      existingSession.save();
    } else {
      //session pas encore existe
      session = new Session({
        userId: user._id,
        expiresAt: new Dat(Date.now() + 1 * 24 * 60 * 1000),
      });
      await session.save();
    }
    //côté navigateur: cookies
    const cookieStore = await cookies();
    cookieStore.set("sessionId", session._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 1 * 24 * 60 * 60,
      sameSite: "Lax", //CSRF request, sécurité pour eviter l'envoie de cookies vers un autre site
    });
    return {
      success: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    return { errorMessage };
  }
}
