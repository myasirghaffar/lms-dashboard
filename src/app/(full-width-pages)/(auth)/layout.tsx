import { ThemeProvider } from "@/context/ThemeContext";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="relative bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
        {children}
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </ThemeProvider>
  );
}
