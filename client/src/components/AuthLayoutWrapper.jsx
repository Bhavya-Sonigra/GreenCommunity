"use client";
import { usePathname } from "next/navigation";
import Layout from "@/components/Layout";

export default function AuthLayoutWrapper({ children }) {
  const pathname = usePathname();
  const authRoutes = [
    "/login",
    "/signup",
    "/Signup",
    "/forgot-password",
    "/update-password",
  ];
  if (authRoutes.includes(pathname)) {
    return <>{children}</>;
  }
  return <Layout>{children}</Layout>;
}
