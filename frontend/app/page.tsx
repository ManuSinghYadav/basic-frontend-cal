import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Addition Calculator
        </h1>

        <p className="mt-4 text-lg text-gray-400">
          A simple calculator to add one to your number.
        </p>

        <Link href="/addition">
          <button className="mt-8 rounded-lg bg-white px-6 py-3 font-medium text-gray-950 transition hover:bg-gray-200">
            Go to Calculator
          </button>
        </Link>
      </div>
    </main>
  );
}