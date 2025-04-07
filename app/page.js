"use client";

import { api } from "/convex/_generated/api";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const createUser = useMutation(api.user.createUser);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      checkUser();
    }
  }, [user]);

  const checkUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress || "unknown",
      imageUrl: user?.imageUrl,
      userName: user?.fullName,
    });
    console.log("User registered:", result);
    router.push("/dashboard"); // redirect to your main app
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-6 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        AI PDF Viewer 📄🤖
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-8">
        Upload your PDFs, take notes side-by-side, and ask AI anything about your document.
        Instant insights, summaries, and explanations — all in one elegant platform.
      </p>

      {!isSignedIn ? (
        <div className="flex gap-4">
          <SignUpButton mode="modal">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg shadow-md">
              Sign Up
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-xl text-lg hover:bg-indigo-50 shadow-md">
              Sign In
            </Button>
          </SignInButton>
        </div>
      ) : (
        <div className="mt-4">
          <UserButton />
        </div>
      )}

      <footer className="absolute bottom-6 text-gray-400 text-sm">
        © 2025 AI PDF Viewer. All rights reserved.
      </footer>
    </div>
  );
}
