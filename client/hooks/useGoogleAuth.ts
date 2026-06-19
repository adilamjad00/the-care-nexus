"use client";

import { useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useGoogleAuthMutation } from "@/store/api/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const PENDING_KEY = "google_auth_pending";

interface UseGoogleAuthProps {
  mode: "login" | "register";
  role?: string;
}

export function useGoogleAuth({ mode, role }: UseGoogleAuthProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [googleAuth, { isLoading }] = useGoogleAuthMutation();

  // After OAuth redirect, the page reloads — complete the flow here
  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;

    const { mode: pendingMode, role: pendingRole } = JSON.parse(raw);

    (async () => {
      const toastId = toast.loading("Signing in with Google...");

      try {
        const session = await getSession();
        const idToken = (session as any)?.id_token;

        if (!idToken) {
          toast.error("Failed to retrieve Google credentials", { id: toastId });
          sessionStorage.removeItem(PENDING_KEY);
          return;
        }

        const res = await googleAuth({
          idToken,
          role: pendingRole || undefined,
        }).unwrap();

        dispatch(
          setCredentials({
            user: res.data || res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          })
        );

        sessionStorage.removeItem(PENDING_KEY);

        // isNew=true → newly created, isNew=false → existing account signed in
        const isNew = res.isNew === true;
        const successMsg = isNew ? "Account created successfully!" : "Welcome back!";
        toast.success(successMsg, { id: toastId });

        const redirectRole = res.data?.role || res.user?.role || pendingRole;
        router.push(`/dashboard/${redirectRole}`);
      } catch (err: any) {
        sessionStorage.removeItem(PENDING_KEY);
        const errorMessage = err?.data?.message;

        toast.error(errorMessage || "Authentication failed", { id: toastId });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGoogleAuth = async () => {
    if (mode === "register" && !role) {
      toast.error("Please select your role first");
      return;
    }

    // Persist mode/role so the useEffect can complete auth after redirect
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ mode, role }));

    // callbackUrl returns user to the same page they were on
    await signIn("google", { callbackUrl: window.location.href });
  };

  return { handleGoogleAuth, isLoading };
}
