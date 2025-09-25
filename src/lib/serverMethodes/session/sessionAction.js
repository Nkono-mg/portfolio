import { cookies } from "next/headers";
import { Session } from "@/app/models/Session";
import { User } from "@/app/models/User";
import { connectToDB } from "@/lib/utils/db/connectToDB";

export async function sessionInfo() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  if (!sessionId) {
    return { success: false };
  }
  await connectToDB();
  const session = await Session.findById(sessionId);
  if (!session || session.expiresAt < new Date()) {
    return { success: false };
  }
  const user = await User.findById(session.userId);
  if (!user) {
    return { success: false };
  }
  return { success: true, userId: user._id.toString() };
}
