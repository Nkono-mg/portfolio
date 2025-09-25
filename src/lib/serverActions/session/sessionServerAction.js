"use server";

import { User } from "@/app/models/User";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { Session } from "@/app/models/Session";
import { cookies } from "next/headers";
import AppError from "@/lib/utils/errorhandler/errorHandler";

export async function userRegister(formDataUser) {
  const { userName, email, password, confirmPassword } =
    Object.fromEntries(formDataUser);

  try {
    if (typeof userName !== "string" || userName.trim().length < 3) {
      throw new AppError("Username must be at least 3 characters");
    }
    if (typeof password !== "string" || password.trim().length < 6) {
      throw new AppError("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      throw new AppError("Password is not the same");
    }
    //verification de mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) {
      throw new AppError("Email invalid");
    }
    await connectToDB();
    const user = await User.findOne({
      $or: [{ email }, { userName }], //recherche le username ou le email
    });
    if (user) {
      if (user.userName === userName) {
        throw new AppError("Username already exist");
      } else if (user.email === email) {
        throw new AppError("Email already exist");
      }
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
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        userName: newUser.userName,
      },
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new Error("An error occured while registering");
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
      existingSession.expiresAt = new Date(
        Date.now() + 1 * 24 * 60 * 60 * 1000
      );
      await existingSession.save();
    } else {
      //session pas encore existe
      session = new Session({
        userId: user._id,
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
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
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    return { success: false, message: errorMessage };
  }
}
export async function logoutUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  try {
    //suppression session côté serveur
    await Session.findByIdAndDelete(sessionId);
    //suppression session côté client
    cookieStore.set("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, //suppression de cookie immédiate
      sameSite: "strict",
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
