import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-950 px-6">
      <div className="flex flex-col items-center">

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">
            Sign in to Addition
          </h1>

          <p className="mt-2 text-gray-400">
            Sign in to use the calculator.
          </p>
        </div>

        <SignIn
          fallbackRedirectUrl="/addition"
          signUpFallbackRedirectUrl="/addition"
        />

      </div>
    </main>
  );
}