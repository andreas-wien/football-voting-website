import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // A

export const POST = async (req, res) => {
  return await NextAuth(req, res, authOptions);
};

export const GET = async (req, res) => {
  return await NextAuth(req, res, authOptions);
};
