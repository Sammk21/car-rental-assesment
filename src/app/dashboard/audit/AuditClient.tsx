"use client";

import { useRouter } from "next/navigation";
import { AuditLog } from "@/types";
import { ArrowLeft, Clock, User, FileText } from "lucide-react";

interface AuditClientProps {
  auditLogs: (AuditLog & { listing_title: string })[];
}

export default function AuditClient({ auditLogs }: AuditClientProps) {
  const router = useRouter();

  const getActionIcon = (action: string) => {
    switch (action) {
      case "approve":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "reject":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case "edit":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Actions
            </h2>
            <p className="text-sm text-gray-600">
              Track all administrative actions performed on listings
            </p>
          </div>

          <div className="overflow-hidden">
            {auditLogs.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No audit logs found.
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {auditLogs.map((log, index) => (
                    <li key={log.id}>
                      <div className="relative pb-8">
                        {index !== auditLogs.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div className="relative">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                              {getActionIcon(log.action)}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">
                                  {log.admin_username}
                                </span>{" "}
                                {log.action === "approve" && "approved"}
                                {log.action === "reject" && "rejected"}
                                {log.action === "edit" && "edited"}
                                {log.action === "create" && "created"}{" "}
                                <span className="font-medium">
                                  {log.listing_title ||
                                    `Listing #${log.listing_id}`}
                                </span>
                              </p>
                              {log.old_values && log.new_values && (
                                <div className="mt-2 text-sm text-gray-500">
                                  <details className="cursor-pointer">
                                    <summary className="hover:text-gray-700">
                                      View changes
                                    </summary>
                                    <div className="mt-2 bg-gray-50 rounded-md p-3">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-medium text-gray-900">
                                            Before:
                                          </h4>
                                          <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                                            {JSON.stringify(
                                              JSON.parse(log.old_values),
                                              null,
                                              2
                                            )}
                                          </pre>
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-gray-900">
                                            After:
                                          </h4>
                                          <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                                            {JSON.stringify(
                                              JSON.parse(log.new_values),
                                              null,
                                              2
                                            )}
                                          </pre>
                                        </div>
                                      </div>
                                    </div>
                                  </details>
                                </div>
                              )}
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDate(log.created_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
