"use client";

import { motion } from "framer-motion";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="container pb-10 pt-4">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
