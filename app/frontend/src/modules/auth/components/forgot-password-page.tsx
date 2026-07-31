"use client";

import Link from "next/link";
import {
  ArrowLeft,
  KeyRound,
  Mail,
  Video,
} from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";

import { useForgotPassword } from "../hooks/use-forgot-password";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/forgot-password.schema";

export function ForgotPasswordPage() {
  const forgotPasswordMutation =
    useForgotPassword();

  const form =
    useForm<ForgotPasswordFormValues>({
      resolver: zodResolver(
        forgotPasswordSchema,
      ),

      defaultValues: {
        email: "",
      },
    });

  function handleForgotPassword(
    values: ForgotPasswordFormValues,
  ) {
    forgotPasswordMutation.mutate({
      email: values.email,
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
          className="mx-auto mb-8 flex w-fit items-center gap-2"
          aria-label="Return to MeetFlow home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Video className="size-5" />
          </span>

          <span className="text-xl font-semibold tracking-tight">
            MeetFlow
          </span>
        </Link>

        <Card className="overflow-hidden border-border/70 shadow-2xl shadow-black/5">
          <CardHeader className="space-y-5 px-6 pb-6 pt-8 text-center sm:px-8">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <KeyRound className="size-7" />
            </span>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Forgot your password?
              </CardTitle>

              <CardDescription className="mx-auto max-w-sm text-sm leading-6">
                Enter your account email and
                we&apos;ll send you a six-digit
                password-reset code.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-8 sm:px-8">
            <form
              onSubmit={form.handleSubmit(
                handleForgotPassword,
              )}
              className="space-y-5"
              noValidate
            >
              <Field>
                <FieldLabel htmlFor="email">
                  Email address
                </FieldLabel>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    autoFocus
                    disabled={
                      forgotPasswordMutation.isPending
                    }
                    className="h-11 pl-10"
                    aria-invalid={Boolean(
                      form.formState.errors.email,
                    )}
                    {...form.register("email")}
                  />
                </div>

                <FieldError>
                  {
                    form.formState.errors.email
                      ?.message
                  }
                </FieldError>
              </Field>

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={
                  forgotPasswordMutation.isPending
                }
              >
                {forgotPasswordMutation.isPending ? (
                  <>
                    <Spinner />
                    Sending code...
                  </>
                ) : (
                  "Send reset code"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-border/60 px-6 py-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="size-4" />
              Return to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}