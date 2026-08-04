"use client";

import {
  ArrowRight,
  Plus,
  Video,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { useCreateMeeting } from "../hooks/use-create-meeting";
import { useJoinMeeting } from "../hooks/use-join-meeting";
import {
  joinMeetingSchema,
  type JoinMeetingFormValues,
} from "../schemas/join-meeting.schema";

export function DashboardMeetingActions() {
  const createMeetingMutation =
    useCreateMeeting();

  const joinMeetingMutation =
    useJoinMeeting();

  const form =
    useForm<JoinMeetingFormValues>({
      resolver: zodResolver(
        joinMeetingSchema,
      ),

      defaultValues: {
        meetingCode: "",
      },
    });

  const isBusy =
    createMeetingMutation.isPending ||
    joinMeetingMutation.isPending;

  function handleCreateMeeting() {
    createMeetingMutation.mutate({
      title: "Instant Meeting",
    });
  }

  function handleJoinMeeting(
    values: JoinMeetingFormValues,
  ) {
    joinMeetingMutation.mutate(
      values.meetingCode,
    );
  }

  return (
    <div className="space-y-5">
      <Button
        type="button"
        className="h-12 w-full justify-between px-5"
        disabled={isBusy}
        onClick={handleCreateMeeting}
      >
        <span className="flex items-center gap-3">
          {createMeetingMutation.isPending ? (
            <Spinner />
          ) : (
            <Video className="size-5" />
          )}

          {createMeetingMutation.isPending
            ? "Creating meeting..."
            : "Start an instant meeting"}
        </span>

        <ArrowRight className="size-4" />
      </Button>

      <form
        onSubmit={form.handleSubmit(
          handleJoinMeeting,
        )}
        className="flex flex-col gap-3 sm:flex-row"
        noValidate
      >
        <Field className="flex-1">
          <Input
            placeholder="Enter meeting code"
            className="h-11 uppercase"
            maxLength={6}
            disabled={isBusy}
            aria-invalid={Boolean(
              form.formState.errors
                .meetingCode,
            )}
            {...form.register(
              "meetingCode",
            )}
          />

          <FieldError>
            {
              form.formState.errors
                .meetingCode?.message
            }
          </FieldError>
        </Field>

        <Button
          type="submit"
          variant="outline"
          className="h-11 sm:px-6"
          disabled={isBusy}
        >
          {joinMeetingMutation.isPending ? (
            <>
              <Spinner />
              Joining...
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Join meeting
            </>
          )}
        </Button>
      </form>
    </div>
  );
}