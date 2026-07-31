"use client";

import Link from "next/link";
import {
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Video,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Controller,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  REGEXP_ONLY_DIGITS,
} from "input-otp";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";

import { useResetPassword } from "../hooks/use-reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password.schema";

import { PasswordInput } from "./password-input";

export function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const email =
    searchParams.get("email")?.trim() ?? "";

  const resetPasswordMutation =
    useResetPassword();

  const form =
    useForm<ResetPasswordFormValues>({
      resolver: zodResolver(
        resetPasswordSchema,
      ),

      defaultValues: {
        otp: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

  const otpValue = form.watch("otp");

  function handleResetPassword(
    values: ResetPasswordFormValues,
  ) {
    if (!email) {
      return;
    }

    resetPasswordMutation.mutate({
      email,
      otp: values.otp,
      newPassword:
        values.newPassword,
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
              <LockKeyhole className="size-7" />
            </span>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Create a new password
              </CardTitle>

              <CardDescription className="text-sm leading-6">
                {email ? (
                  <>
                    Enter the code sent to{" "}
                    <span className="font-medium text-foreground">
                      {email}
                    </span>{" "}
                    and choose a new password.
                  </>
                ) : (
                  "Your password-reset email is missing."
                )}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-8 sm:px-8">
            {email ? (
              <form
                onSubmit={form.handleSubmit(
                  handleResetPassword,
                )}
                className="space-y-5"
                noValidate
              >
                <Controller
                  control={form.control}
                  name="otp"
                  render={({
                    field,
                    fieldState,
                  }) => (
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel>
                          Reset code
                        </FieldLabel>

                        <span className="text-xs text-muted-foreground">
                          {field.value.length}/6
                        </span>
                      </div>

                      <div className="flex justify-center py-2">
                        <InputOTP
                          maxLength={6}
                          pattern={
                            REGEXP_ONLY_DIGITS
                          }
                          value={field.value}
                          onChange={
                            field.onChange
                          }
                          disabled={
                            resetPasswordMutation.isPending
                          }
                          autoFocus
                          autoComplete="one-time-code"
                          aria-invalid={
                            fieldState.invalid
                          }
                        >
                          <InputOTPGroup className="gap-2 sm:gap-3">
                            {Array.from(
                              { length: 6 },
                              (_, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className="size-11 rounded-lg border text-base font-semibold sm:size-12"
                                />
                              ),
                            )}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      <FieldError>
                        {
                          fieldState.error
                            ?.message
                        }
                      </FieldError>
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel htmlFor="newPassword">
                    New password
                  </FieldLabel>

                  <PasswordInput
                    id="newPassword"
                    placeholder="Enter a new password"
                    autoComplete="new-password"
                    disabled={
                      resetPasswordMutation.isPending
                    }
                    className="h-11"
                    aria-invalid={Boolean(
                      form.formState.errors
                        .newPassword,
                    )}
                    {...form.register(
                      "newPassword",
                    )}
                  />

                  <FieldError>
                    {
                      form.formState.errors
                        .newPassword?.message
                    }
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm new password
                  </FieldLabel>

                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Re-enter the password"
                    autoComplete="new-password"
                    disabled={
                      resetPasswordMutation.isPending
                    }
                    className="h-11"
                    aria-invalid={Boolean(
                      form.formState.errors
                        .confirmPassword,
                    )}
                    {...form.register(
                      "confirmPassword",
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
                    resetPasswordMutation.isPending ||
                    otpValue.length !== 6
                  }
                >
                  {resetPasswordMutation.isPending ? (
                    <>
                      <Spinner />
                      Updating password...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      Reset password
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Start a new password-reset
                  request so we know which account
                  should be updated.
                </p>

                <Button className="w-full">
                  <Link href="/forgot-password">Request reset code</Link>
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t border-border/60 px-6 py-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <KeyRound className="size-4" />
              Return to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}