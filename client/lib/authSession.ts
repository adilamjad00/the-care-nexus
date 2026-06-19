export const AUTH_EXPIRED_EVENT = "carenexus-auth-expired";

export const expireSession = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  window.location.replace("/login");
};
