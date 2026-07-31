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

import { useRegister } from "../hooks/use-register";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/register.schema";

import { PasswordInput } from "./password-input";
import { SocialLogin } from "./social-login";

export function RegisterPage() {
  const registerMutation = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function handleRegister(
    values: RegisterFormValues
  ) {
    registerMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_32%),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.10),transparent_30%)]"
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
              Create your account
            </CardTitle>

            <CardDescription className="text-sm leading-6">
              Start hosting secure meetings with
              MeetFlow.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(
                handleRegister
              )}
              className="space-y-5"
              noValidate
            >
              <Field>
                <FieldLabel htmlFor="name">
                  Full name
                </FieldLabel>

                <Input
                  id="name"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={
                    registerMutation.isPending
                  }
                  className="h-11"
                  aria-invalid={Boolean(
                    form.formState.errors.name
                  )}
                  {...form.register("name")}
                />

                <FieldError>
                  {
                    form.formState.errors.name
                      ?.message
                  }
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">
                  Email address
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={
                    registerMutation.isPending
                  }
                  className="h-11"
                  aria-invalid={Boolean(
                    form.formState.errors.email
                  )}
                  {...form.register("email")}
                />

                <FieldError>
                  {
                    form.formState.errors.email
                      ?.message
                  }
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <PasswordInput
                  id="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={
                    registerMutation.isPending
                  }
                  className="h-11"
                  aria-invalid={Boolean(
                    form.formState.errors.password
                  )}
                  {...form.register("password")}
                />

                <FieldError>
                  {
                    form.formState.errors.password
                      ?.message
                  }
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm password
                </FieldLabel>

                <PasswordInput
                  id="confirmPassword"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  disabled={
                    registerMutation.isPending
                  }
                  className="h-11"
                  aria-invalid={Boolean(
                    form.formState.errors
                      .confirmPassword
                  )}
                  {...form.register(
                    "confirmPassword"
                  )}
                />

                <FieldError>
                  {
                    form.formState.errors
                      .confirmPassword?.message
                  }
                </FieldError>
              </Field>

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={
                  registerMutation.isPending
                }
              >
                {registerMutation.isPending ? (
                  <>
                    <Spinner />
                    Creating account...
                  </>
                ) : (
                  "Create account"
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

            <SocialLogin disabled />
          </CardContent>

          <CardFooter className="flex-col gap-4 border-t border-border/60 pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}