"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clearSession, createSession, getSession } from "@/lib/auth";

function getRequiredValue(formData: FormData, field: string) {
  const value = formData.get(field);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

function getPassword(formData: FormData) {
  const password = getRequiredValue(formData, "password");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  const confirmation = getRequiredValue(formData, "passwordConfirmation");
  if (password !== confirmation) throw new Error("Passwords do not match.");
  return password;
}

export async function createCustomerAccount(formData: FormData) {
  const name = getRequiredValue(formData, "name");
  const email = getRequiredValue(formData, "email").toLowerCase();
  const passwordHash = await bcrypt.hash(getPassword(formData), 12);

  const customer = await prisma.customer.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });

  await createSession(customer.id, "CUSTOMER");
  redirect("/products");
}

export async function signInCustomer(formData: FormData) {
  const email = getRequiredValue(formData, "email").toLowerCase();
  const password = getRequiredValue(formData, "password");
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer?.passwordHash || !(await bcrypt.compare(password, customer.passwordHash))) throw new Error("Invalid email or password.");
  await createSession(customer.id, "CUSTOMER");
  redirect("/products");
}

export async function updateCustomerProfile(formData: FormData) {
  const session = await getSession();
  if (!session || session.userType !== "CUSTOMER") redirect("/account/customer/signin");
  const name = getRequiredValue(formData, "name");
  const phoneValue = formData.get("phone");
  const phone = typeof phoneValue === "string" && phoneValue.trim() ? phoneValue.trim() : null;
  const addressValue = formData.get("address");
  const address = typeof addressValue === "string" && addressValue.trim() ? addressValue.trim() : null;
  const photoValue = formData.get("profilePhoto");
  let profilePhoto: string | null | undefined;
  if (photoValue instanceof File && photoValue.size > 0) {
    if (!photoValue.type.startsWith("image/")) throw new Error("Profile photo must be an image.");
    if (photoValue.size > 2 * 1024 * 1024) throw new Error("Profile photo must be smaller than 2 MB.");
    const bytes = Buffer.from(await photoValue.arrayBuffer());
    profilePhoto = `data:${photoValue.type};base64,${bytes.toString("base64")}`;
  }
  await prisma.customer.update({ where: { id: session.userId }, data: { name, phone, address, ...(profilePhoto ? { profilePhoto } : {}) } });
  redirect("/account/customer/profile?saved=1");
}

export async function createSellerAccount(formData: FormData) {
  const name = getRequiredValue(formData, "name");
  const shopName = getRequiredValue(formData, "shopName");
  const email = getRequiredValue(formData, "email").toLowerCase();
  const phoneValue = formData.get("phone");
  const phone = typeof phoneValue === "string" && phoneValue.trim() ? phoneValue.trim() : null;
  const passwordHash = await bcrypt.hash(getPassword(formData), 12);

  const seller = await prisma.seller.upsert({
    where: { email },
    update: { name, shopName, phone, passwordHash },
    create: { email, name, shopName, phone, passwordHash },
  });

  await createSession(seller.id, "SELLER");
  redirect("/admin");
}

export async function updateSellerProfile(formData: FormData) {
  const session = await getSession();
  if (!session || session.userType !== "SELLER") redirect("/account/seller/signin");
  const name = getRequiredValue(formData, "name");
  const shopName = getRequiredValue(formData, "shopName");
  const phoneValue = formData.get("phone");
  const phone = typeof phoneValue === "string" && phoneValue.trim() ? phoneValue.trim() : null;
  const photoValue = formData.get("profilePhoto");
  let profilePhoto: string | undefined;
  if (photoValue instanceof File && photoValue.size > 0) {
    if (!photoValue.type.startsWith("image/")) throw new Error("Profile photo must be an image.");
    if (photoValue.size > 2 * 1024 * 1024) throw new Error("Profile photo must be smaller than 2 MB.");
    profilePhoto = `data:${photoValue.type};base64,${Buffer.from(await photoValue.arrayBuffer()).toString("base64")}`;
  }
  await prisma.seller.update({ where: { id: session.userId }, data: { name, shopName, phone, ...(profilePhoto ? { profilePhoto } : {}) } });
  redirect("/account/seller/profile?saved=1");
}

export async function signInSeller(formData: FormData) {
  const email = getRequiredValue(formData, "email").toLowerCase();
  const password = getRequiredValue(formData, "password");
  const seller = await prisma.seller.findUnique({ where: { email } });
  if (!seller?.passwordHash || !(await bcrypt.compare(password, seller.passwordHash))) throw new Error("Invalid email or password.");
  await createSession(seller.id, "SELLER");
  redirect("/admin");
}

export async function signOut() {
  await clearSession();
  redirect("/");
}
