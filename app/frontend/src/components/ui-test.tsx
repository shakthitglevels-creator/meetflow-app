"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

export function UiTest() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>MeetFlow UI Test</CardTitle>

        <CardDescription>
          Verify the reusable form components.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="test-email">
            Email address
          </Label>

          <Input
            id="test-email"
            type="email"
            placeholder="name@example.com"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="test-remember" />

          <Label htmlFor="test-remember">
            Remember me
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />

          <span className="text-xs text-muted-foreground">
            OR
          </span>

          <Separator className="flex-1" />
        </div>

        <Button className="w-full">
          Continue
        </Button>

        <Button
          className="w-full"
          disabled
        >
          <Spinner />
          Signing in...
        </Button>
      </CardContent>
    </Card>
  );
}