

"use client";

import Link from "next/link";
import { Video } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { useLogin } from "../hooks/use-login";
import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/login.schema";

import { PasswordInput } from "./password-input";
import { SocialLogin } from "./social-login";

export function LoginPage() {
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleLogin(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_32%),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.10),transparent_30%)]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mx-auto mb-7 flex w-fit items-center gap-2"
          aria-label="Return to MeetFlow home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Video className="size-5" />
          </span>

          <span className="text-xl font-semibold tracking-tight">
            MeetFlow
          </span>
        </Link>

        <Card className="border-border/70 shadow-2xl shadow-black/5">
          <CardHeader className="space-y-2 pb-6 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Welcome back
            </CardTitle>

            <CardDescription className="text-sm leading-6">
              Sign in to continue to your MeetFlow workspace.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-5"
              noValidate
            >
              <Field>
                <FieldLabel htmlFor="email">
                  Email address
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  autoFocus
                  disabled={loginMutation.isPending}
                  className="h-11"
                  aria-invalid={Boolean(
                    form.formState.errors.email
                  )}
                  {...form.register("email")}
                />

                <FieldError>
                  {form.formState.errors.email?.message}
                </FieldError>
              </Field>

              <Field>
                <div className="flex items-center justify-between gap-4">
                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loginMutation.isPending}
                  className="h-11"
                  aria-invalid={Boolean(
                    form.formState.errors.password
                  )}
                  {...form.register("password")}
                />

                <FieldError>
                  {form.formState.errors.password?.message}
                </FieldError>
              </Field>

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Spinner />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1" />

              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Or continue with
              </span>

              <Separator className="flex-1" />
            </div>

          <SocialLogin mode="signin" />
          </CardContent>

          <CardFooter className="flex-col gap-4 border-t border-border/60 pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          By continuing, you agree to MeetFlow&apos;s{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}