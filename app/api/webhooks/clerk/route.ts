import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const primaryEmail = email_addresses.find(
      (e) => e.id === evt.data.primary_email_address_id
    )?.email_address;

    await prisma.user.create({
      data: {
        clerkId: id,
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
      },
    });

    console.log(`User created: ${id}`);
  }

  if (evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const primaryEmail = email_addresses.find(
      (e) => e.id === evt.data.primary_email_address_id
    )?.email_address;

    await prisma.user.update({
      where: { clerkId: id },
      data: {
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
      },
    });

    console.log(`User updated: ${id}`);
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;

    if (id) {
      // Delete orders first (OrderItems cascade automatically).
      // For IRL - there should be a better method to preserve
      // financial records while keeping the user's privacy
      await prisma.order.deleteMany({
        where: { user: { clerkId: id } },
      });

      // Now delete user (Cart and CartItems cascade automatically)
      await prisma.user.delete({
        where: { clerkId: id },
      });

      console.log(`User deleted: ${id}`);
    }
  }

  return new Response("OK", { status: 200 });
}
