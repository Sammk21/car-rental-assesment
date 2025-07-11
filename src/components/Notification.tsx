"use client";

import { useNotification } from "@/context/NotificationContext";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-md ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : notification.type === "error"
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-blue-50 border border-blue-200 text-blue-800"
          }`}
        >
          {notification.type === "success" && (
            <CheckCircle className="w-5 h-5" />
          )}
          {notification.type === "error" && <AlertCircle className="w-5 h-5" />}
          {notification.type === "info" && <Info className="w-5 h-5" />}
          <p className="flex-1 text-sm">{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-current hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
