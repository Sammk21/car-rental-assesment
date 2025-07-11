"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Listing } from "@/types";
import { useNotification } from "@/context/NotificationContext";
import { ListingForm } from "@/components/ListingForm";
import {
  Check,
  X,
  Edit,
  LogOut,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

interface DashboardClientProps {
  listings: Listing[];
  currentPage: number;
  totalPages: number;
  currentStatus: string;
  currentSearch: string;
  username: string;
}

//memoizing the rows 
const ListingRow = React.memo(
  ({
    listing,
    onAction,
    onEdit,
    getStatusBadge,
  }: {
    listing: Listing;
    onAction: (id: number, action: "approve" | "reject") => void;
    onEdit: (listing: Listing) => void;
    getStatusBadge: (status: string) => string;
  }) => {
    const handleApprove = useCallback(
      () => onAction(listing.id, "approve"),
      [listing.id, onAction]
    );
    const handleReject = useCallback(
      () => onAction(listing.id, "reject"),
      [listing.id, onAction]
    );
    const handleEdit = useCallback(() => onEdit(listing), [listing, onEdit]);

    return (
      <tr key={listing.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16 relative">
              {listing.image_url ? (
                <Image
                  fill
                  className="h-16 w-16 rounded-lg object-cover"
                  src={
                    listing.image_url ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s"
                  }
                  alt={listing.title}
                  onError={(e) => {
                    e.currentTarget.src = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s`;
                  }}
                />
              ) : (
                <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">
                    {listing.make.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {listing.title}
              </div>
              <div className="text-sm text-gray-500">
                {listing.make} {listing.model} ({listing.year})
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            ${listing.price_per_day}/day
          </div>
          <div className="text-sm text-gray-500">{listing.location}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={getStatusBadge(listing.status)}>
            {listing.status}
          </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            <button
              onClick={handleApprove}
              className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                listing.status === "approved"
                  ? "text-green-700 bg-green-100 hover:bg-green-200"
                  : "text-white bg-green-600 hover:bg-green-700"
              }`}
            >
              <Check className="w-4 h-4 mr-1" />
              {listing.status === "approved" ? "Approved" : "Approve"}
            </button>
            <button
              onClick={handleReject}
              className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                listing.status === "rejected"
                  ? "text-red-700 bg-red-100 hover:bg-red-200"
                  : "text-white bg-red-600 hover:bg-red-700"
              }`}
            >
              <X className="w-4 h-4 mr-1" />
              {listing.status === "rejected" ? "Rejected" : "Reject"}
            </button>

            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

ListingRow.displayName = "ListingRow";

const Pagination = React.memo(
  ({
    currentPage,
    totalPages,
    statusFilter,
    searchTerm,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    statusFilter: string;
    searchTerm: string;
    onPageChange: (page: number) => void;
  }) => {
    const generatePageNumbers = useMemo(() => {
      const pages = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + maxVisible - 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }

      return pages;
    }, [currentPage, totalPages]);

    const handlePrevious = useCallback(
      () => onPageChange(currentPage - 1),
      [currentPage, onPageChange]
    );
    const handleNext = useCallback(
      () => onPageChange(currentPage + 1),
      [currentPage, onPageChange]
    );

    if (totalPages <= 1) return null;

    return (
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {generatePageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export default function DashboardClient({
  listings: initialListings,
  currentPage,
  totalPages,
  currentStatus,
  currentSearch,
  username,
}: DashboardClientProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [statusFilter, setStatusFilter] = useState(currentStatus);
  const [loadingListings, setLoadingListings] = useState<Set<number>>(
    new Set()
  );

  const router = useRouter();
  const { addNotification } = useNotification();
  const searchParams = useSearchParams();

  // Sync state with URL params
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    setSearchTerm(search);
    setStatusFilter(status);
  }, [searchParams]);

  // Update listings when props change
  useEffect(() => {
    setListings(initialListings);
  }, [initialListings]);

  // Memoized status badge function
  const getStatusBadge = useCallback((status: string) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  }, []);

  const handleAction = useCallback(
    async (listingId: number, action: "approve" | "reject") => {
      if (loadingListings.has(listingId)) return;

      setLoadingListings((prev) => new Set(prev).add(listingId));

      try {
        const response = await fetch(`/api/listings/${listingId}/${action}`, {
          method: "POST",
        });

        if (response.ok) {
          setListings((prevListings) =>
            prevListings.map((listing) =>
              listing.id === listingId
                ? {
                    ...listing,
                    status: action === "approve" ? "approved" : "rejected",
                  }
                : listing
            )
          );

          addNotification(`Listing ${action}d successfully`, "success");
        } else {
          throw new Error(`Failed to ${action} listing`);
        }
      } catch (error) {
        addNotification(`Failed to ${action} listing`, "error");
      } finally {
        setLoadingListings((prev) => {
          const newSet = new Set(prev);
          newSet.delete(listingId);
          return newSet;
        });
      }
    },
    [loadingListings, addNotification]
  );

  const handleEdit = useCallback(
    async (data: Partial<Listing>) => {
      if (!editingListing) return;

      try {
        const response = await fetch(`/api/listings/${editingListing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const updatedListing = await response.json();

          setListings((prevListings) =>
            prevListings.map((listing) =>
              listing.id === editingListing.id
                ? { ...listing, ...updatedListing }
                : listing
            )
          );

          setEditingListing(null);
          addNotification("Listing updated successfully", "success");
        } else {
          throw new Error("Failed to update listing");
        }
      } catch (error) {
        addNotification("Failed to update listing", "error");
        throw error;
      }
    },
    [editingListing, addNotification]
  );

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter !== "all") params.set("status", statusFilter);
    params.set("page", "1");
    router.push(`/dashboard?${params.toString()}`);
  }, [searchTerm, statusFilter, router]);

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(
        `/dashboard?page=${page}&status=${statusFilter}&search=${searchTerm}`
      );
    },
    [statusFilter, searchTerm, router]
  );

  const handleEditListing = useCallback((listing: Listing) => {
    setEditingListing(listing);
  }, []);

  //memoized serach 
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value);
    },
    []
  );

  if (editingListing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Listing: {editingListing.title}
            </h1>
            <ListingForm
              listing={editingListing}
              onSubmit={handleEdit}
              onCancel={() => setEditingListing(null)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {username}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={applyFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No listings found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => (
                    <ListingRow
                      key={listing.id}
                      listing={listing}
                      onAction={handleAction}
                      onEdit={handleEditListing}
                      getStatusBadge={getStatusBadge}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          statusFilter={statusFilter}
          searchTerm={searchTerm}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
