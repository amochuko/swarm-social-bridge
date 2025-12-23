import { WalletConnectButton } from "./WalletConnect";

export function Header() {
  return (
    <header
      style={{
        display: "flex",
        padding: "12px",
      }}
    >
      <div style={{ flex: "1" }}>
        <span style={{ fontSize: "24px" }}>SSDApp</span>
      </div>
      <WalletConnectButton />
    </header>
  );
}
