import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function SidebarWidget() {
  const { user } = useAuth();

  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        Need Help?
      </h3>
      <p className="mb-4 text-gray-500 text-sm dark:text-gray-400">
        Contact support if you need assistance with the system.
      </p>
      <a
        href="mailto:support@schoollms.com"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition text-sm"
      >
        Contact Support
      </a>

      {user && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">Logged in as:</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{user.name}</p>
          <p className="text-xs text-blue-500 font-medium mt-1">{user.role}</p>
        </div>
      )}
    </div>
  );
}
