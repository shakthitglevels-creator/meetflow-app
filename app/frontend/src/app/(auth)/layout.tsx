// import type { ReactNode } from "react";

// type AuthLayoutProps = {
//   children: ReactNode;
// };

// export default function AuthLayout({
//   children,
// }: AuthLayoutProps) {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
//       {children}
//     </main>
//   );
// }


import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return <main className="min-h-screen">{children}</main>;
}