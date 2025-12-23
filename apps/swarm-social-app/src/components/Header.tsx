import { Link, NavLink } from "react-router";
import { useProviderStore } from "../store/useProviderStore";
import { WalletConnectButton } from "./WalletConnect";

export function Header() {
  const account = useProviderStore((s) => s.account);

  const navMenuItems = [
    { name: "Messages", path: "/message" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header
      style={{
        display: "flex",
        padding: "12px",
      }}
    >
      <nav
        style={{
          flex: "1",
          gap: 16,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <span
          style={{ fontSize: "24px", fontWeight: "bold", marginRight: 124 }}
        >
          <Link style={{ textDecoration: "none" }} to={"/"}>
            SwarmSocialDApp
          </Link>
        </span>

        {account &&
          navMenuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
              style={{
                marginLeft: 16,
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              {item.name}
            </NavLink>
          ))}
      </nav>

      <WalletConnectButton />
    </header>
  );
}
