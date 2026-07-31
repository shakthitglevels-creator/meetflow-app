"use client";

import {
  forwardRef,
  useState,
  type ComponentProps,
} from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<
  ComponentProps<typeof Input>,
  "type"
>;

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, disabled, ...props }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={isPasswordVisible ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-11", className)}
        {...props}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        onClick={() => {
          setIsPasswordVisible((currentValue) => {
            return !currentValue;
          });
        }}
        className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
        aria-label={
          isPasswordVisible
            ? "Hide password"
            : "Show password"
        }
      >
        {isPasswordVisible ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </Button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";