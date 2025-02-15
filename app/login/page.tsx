"use client";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import * as React from "react";
import { SVGProps } from "react";
import { useRouter } from "next/navigation";
const supabase = createClient();

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-6">
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-evenly"
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `http://localhost:3000/auth/callback`,
                },
              });
            }}
          >
            <GoogleIcon className="mr-2 h-5 w-5 " fill="white" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <title>{"Google"}</title>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);
