"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

type HistoryItem = {
  number: string;
  time: string;
};

export default function HistoryPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchHistory = async () => {
      try {
        const token = await getToken();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data = await response.json();

        setHistory(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading history...</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Please sign in to view your history.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
  
      {/* Calculator button */}
      <div className="mx-auto flex max-w-6xl justify-end">
        <Link
          href="/addition"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
        >
          Calculator
        </Link>
      </div>
  
      <div className="mx-auto max-w-2xl pt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Addition History
          </h1>

          <p className="mt-2 text-gray-500">
            Your previous calculations
          </p>
        </div>

        {error && (
          <p className="mb-4 text-red-500">
            {error}
          </p>
        )}

        {history.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              No calculations yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {item.number} + 1
                  </p>

                  <p className="text-sm text-gray-500">
                    Result: {Number(item.number) + 1}
                  </p>
                </div>

                <p className="text-sm text-gray-400">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}