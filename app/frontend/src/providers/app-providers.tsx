// "use client";

// import { QueryProvider } from "./query-provider";
// import { ThemeProvider } from "./theme-provider";
// import { ToastProvider } from "./toast-provider";


// type AppProvidersProps = {
//   children: React.ReactNode;
// };

// export function AppProviders({
//   children,
// }: AppProvidersProps) {
//   return (
//         <ThemeProvider>
//       <QueryProvider>
//         {children}

//         <ToastProvider />
//       </QueryProvider>
//     </ThemeProvider>
//   );
// }






"use client";

import type { ReactNode } from "react";

import { GoogleAuthProvider } from "./google-auth-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./toast-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <GoogleAuthProvider>
        <QueryProvider>
          {children}

          <ToastProvider />
        </QueryProvider>
      </GoogleAuthProvider>
    </ThemeProvider>
  );
}