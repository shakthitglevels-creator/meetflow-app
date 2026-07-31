// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";

// type SocialLoginProps = {
//   isLoading?: boolean;
//   disabled?: boolean;
//   onGoogleLogin?: () => void;
// };

// function GoogleIcon() {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       className="size-4"
//       aria-hidden="true"
//     >
//       <path
//         fill="currentColor"
//         d="M21.35 12.18c0-.64-.06-1.12-.18-1.62H12v3.03h5.38c-.11.75-.69 1.88-1.98 2.64l-.02.1 2.87 2.22.2.02c1.84-1.7 2.9-4.2 2.9-7.39Z"
//       />
//       <path
//         fill="currentColor"
//         d="M12 21.75c2.63 0 4.84-.87 6.45-2.38l-3.05-2.34c-.82.55-1.93.94-3.4.94-2.57 0-4.75-1.7-5.53-4.06l-.1.01-2.98 2.3-.04.1A9.74 9.74 0 0 0 12 21.75Z"
//       />
//       <path
//         fill="currentColor"
//         d="M6.47 13.91A5.86 5.86 0 0 1 6.15 12c0-.66.12-1.3.31-1.91v-.1L3.45 7.65l-.1.05A9.74 9.74 0 0 0 2.25 12c0 1.56.37 3.03 1.1 4.3l3.12-2.39Z"
//       />
//       <path
//         fill="currentColor"
//         d="M12 6.03c1.83 0 3.06.79 3.76 1.45l2.75-2.68C16.82 3.23 14.63 2.25 12 2.25A9.74 9.74 0 0 0 3.35 7.7l3.11 2.39C7.25 7.73 9.43 6.03 12 6.03Z"
//       />
//     </svg>
//   );
// }

// export function SocialLogin({
//   isLoading = false,
//   disabled = false,
//   onGoogleLogin,
// }: SocialLoginProps) {
//   return (
//     <Button
//       type="button"
//       variant="outline"
//       className="h-11 w-full"
//       disabled={disabled || isLoading}
//       onClick={onGoogleLogin}
//     >
//       {isLoading ? (
//         <>
//           <Spinner />
//           Connecting...
//         </>
//       ) : (
//         <>
//           <GoogleIcon />
//           Continue with Google
//         </>
//       )}
//     </Button>
//   );
// }





"use client";

import {
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";

import { useGoogleLogin } from "../hooks/use-google-login";

type SocialLoginProps = {
  mode?: "signin" | "signup";
};

export function SocialLogin({
  mode = "signin",
}: SocialLoginProps) {
  const googleLoginMutation =
    useGoogleLogin();

  function handleGoogleSuccess(
    credentialResponse:
      CredentialResponse,
  ) {
    const credential =
      credentialResponse.credential;

    if (!credential) {
      toast.error(
        "Google did not return a valid credential.",
      );

      return;
    }

    googleLoginMutation.mutate({
      credential,
    });
  }

  function handleGoogleError() {
    toast.error(
      "Google sign-in was cancelled or failed.",
    );
  }

  if (googleLoginMutation.isPending) {
    return (
      <div className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium">
        <Spinner />
        Connecting to Google...
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center overflow-hidden rounded-md">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        type="standard"
        theme="outline"
        size="large"
        shape="rectangular"
        text={
          mode === "signup"
            ? "signup_with"
            : "signin_with"
        }
        logo_alignment="left"
        width="400"
        useOneTap={false}
      />
    </div>
  );
}