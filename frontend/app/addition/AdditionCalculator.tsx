"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function AdditionCalculator() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();

  // console.log("Clerk user:", user);
  // console.log("User ID:", user?.id);
  // console.log("Full name:", user?.fullName);

  async function handleSubmit() {
    if (number === "") {
      setError("Please enter a number.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: Number(number),
          name: user?.fullName,
          userid: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      const data = await response.json();
      setResult(data.result);
    } catch {
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-950 px-6 py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center">

        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-gray-950">
            +
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            Addition Calculator
          </h1>

          <p className="mt-3 text-gray-400">
            Enter a number and we'll add 1 to it.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">

          <label
            htmlFor="number"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Your number
          </label>

          <input
            id="number"
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Enter a number..."
            className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-lg text-white outline-none placeholder:text-gray-600 focus:border-white/30 focus:ring-2 focus:ring-white/10"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-white py-3 font-semibold text-gray-950 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Add 1"}
          </button>

          {error && (
            <p className="mt-4 text-center text-sm text-red-400">
              {error}
            </p>
          )}

          {result !== null && (
            <div className="mt-6 rounded-xl border border-white/10 bg-gray-900 p-6 text-center">
              <p className="text-sm text-gray-500">Result</p>

              <p className="mt-1 text-4xl font-bold">
                {result}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {number} + 1 = {result}
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-gray-600">
          Calculation powered by FastAPI
        </p>
      </div>
    </main>
  );
}