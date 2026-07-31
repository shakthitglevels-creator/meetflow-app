"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MailCheck, RotateCcw, ShieldCheck, Video } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";

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

import { useResendOtp } from "../hooks/use-resend-otp";
import { useVerifyOtp } from "../hooks/use-verify-otp";
import {
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from "../schemas/verify-otp.schema";

const RESEND_COOLDOWN_SECONDS = 30;

export function VerifyOtpPage() {
  const searchParams = useSearchParams();

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const email = searchParams.get("email")?.trim() ?? "";

  const [secondsRemaining, setSecondsRemaining] =
    useState(RESEND_COOLDOWN_SECONDS);

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),

    defaultValues: {
      otp: "",
    },
  });

  const otpValue = form.watch("otp");

  const isBusy =
    verifyOtpMutation.isPending ||
    resendOtpMutation.isPending;

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setSecondsRemaining((currentValue) =>
        Math.max(currentValue - 1, 0)
      );
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [secondsRemaining]);

  function handleVerifyOtp(values: VerifyOtpFormValues) {
    if (!email) {
      return;
    }

    verifyOtpMutation.mutate({
      email,
      otp: values.otp,
    });
  }

  function handleResendOtp() {
    if (
      !email ||
      secondsRemaining > 0 ||
      resendOtpMutation.isPending
    ) {
      return;
    }

    resendOtpMutation.mutate(
      {
        email,
      },
      {
        onSuccess() {
          form.reset({
            otp: "",
          });

          setSecondsRemaining(
            RESEND_COOLDOWN_SECONDS
          );
        },
      }
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.10),transparent_32%)]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mx-auto mb-8 flex w-fit items-center gap-2"
          aria-label="Return to MeetFlow home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Video className="size-5" />
          </span>

          <span className="text-xl font-semibold tracking-tight">
            MeetFlow
          </span>
        </Link>

        <Card className="overflow-hidden border-border/70 shadow-2xl shadow-black/5">
          <CardHeader className="space-y-5 px-6 pb-6 pt-8 text-center sm:px-8">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MailCheck className="size-7" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Check your email
              </CardTitle>

              <CardDescription className="mx-auto max-w-sm text-sm leading-6">
                {email ? (
                  <>
                    We sent a six-digit verification code to{" "}
                    <span className="font-medium text-foreground">
                      {email}
                    </span>
                    .
                  </>
                ) : (
                  "We could not find the email address for this verification request."
                )}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-8 sm:px-8">
            {email ? (
              <form
                onSubmit={form.handleSubmit(handleVerifyOtp)}
                className="space-y-6"
                noValidate
              >
                <Controller
                  control={form.control}
                  name="otp"
                  render={({ field, fieldState }) => (
                    <Field>
                      <div className="flex items-center justify-between gap-4">
                        <FieldLabel>
                          Verification code
                        </FieldLabel>

                        <span className="text-xs text-muted-foreground">
                          {field.value.length}/6
                        </span>
                      </div>

                      <div className="flex justify-center py-2">
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isBusy}
                          autoFocus
                          autoComplete="one-time-code"
                          aria-invalid={fieldState.invalid}
                        >
                          <InputOTPGroup className="gap-2 sm:gap-3">
                            {Array.from(
                              { length: 6 },
                              (_, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  aria-invalid={
                                    fieldState.invalid
                                  }
                                  className="size-11 rounded-lg border text-base font-semibold shadow-sm sm:size-12"
                                />
                              )
                            )}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      <FieldError>
                        {fieldState.error?.message}
                      </FieldError>
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  className="h-11 w-full"
                  disabled={
                    isBusy ||
                    otpValue.length !== 6
                  }
                >
                  {verifyOtpMutation.isPending ? (
                    <>
                      <Spinner />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      Verify account
                    </>
                  )}
                </Button>

                <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn&apos;t receive the email?
                  </p>

                  <Button
                    type="button"
                    variant="link"
                    className="mt-1 h-auto gap-2 px-2 py-1"
                    disabled={
                      secondsRemaining > 0 ||
                      resendOtpMutation.isPending
                    }
                    onClick={handleResendOtp}
                  >
                    {resendOtpMutation.isPending ? (
                      <>
                        <Spinner />
                        Sending code...
                      </>
                    ) : secondsRemaining > 0 ? (
                      `Resend code in ${secondsRemaining}s`
                    ) : (
                      <>
                        <RotateCcw className="size-3.5" />
                        Resend verification code
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-xs leading-5 text-muted-foreground">
                  The code is valid for a limited time.
                  Never share it with anyone.
                </p>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-sm leading-6 text-muted-foreground">
                  No email address was provided. Return
                  to registration and submit your account
                  details again.
                </p>

                <Link
                  href="/register"
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-muted px-4 text-sm font-medium text-foreground transition hover:bg-muted/80"
                >
                  Return to registration
                </Link>
              </div>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t border-border/60 px-6 py-6">
            <p className="text-center text-sm text-muted-foreground">
              Already verified?{" "}
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