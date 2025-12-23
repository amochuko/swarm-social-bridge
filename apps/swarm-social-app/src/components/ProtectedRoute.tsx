import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useProviderStore } from "../store/useProviderStore";

type ProtectedRouteType = {
  children: ReactNode;
  redirectTo: string;
};
export default function ProtectedRoute(props: ProtectedRouteType) {
  const account = useProviderStore((s) => s.account);
  const provider = useProviderStore((s) => s.provider);
  const navigator = useNavigate();

  useEffect(() => {
    if (!account && !provider) {
      navigator(props.redirectTo, { replace: true, flushSync: true });
    }
  }, [account, provider, navigator, props.redirectTo]);

  return <>{props.children}</>;
}
