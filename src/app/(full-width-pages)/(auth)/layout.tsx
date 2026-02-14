import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-4">
                  <Image
                    width={231}
                    height={48}
                    src="./images/logo/auth-logo.svg"
                    alt="Logo"
                  />
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60 mb-6 font-semibold">
                  AMS Talwandi Schools Management System
                </p>

                {/* Demo Credentials Box */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-white w-full shadow-2xl">
                  <p className="font-bold mb-4 text-center border-b border-white/10 pb-2 uppercase tracking-wider text-[#92257B]">Demo Credentials</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-gray-400">Super Admin</span>
                      <span className="font-medium">admin@example.com</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-gray-400">Branch Admin</span>
                      <span className="font-medium">principal@school.com</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-gray-400">Teacher</span>
                      <span className="font-medium">teacher1@example.com</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-gray-400">Student</span>
                      <span className="font-medium">student1@example.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Parent</span>
                      <span className="font-medium">parent1@example.com</span>
                    </div>
                    <div className="mt-4 pt-2 text-center bg-white/5 rounded-lg py-2">
                      <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Default Password</span>
                      <p className="text-[#92257B] font-black text-xl">any</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
