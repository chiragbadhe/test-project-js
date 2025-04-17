"use client";

import { Github, Wallet, LogOut } from "lucide-react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { useDisconnect } from "@reown/appkit/react";

export function Header() {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  const headerStyle = {
    borderBottom: "1px solid #1f1f1f",
    background: "rgba(10, 10, 10, 0.5)",
    backdropFilter: "blur(8px)"
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: 600
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #1f1f1f",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#1f1f1f"
    }
  };

  const githubLinkStyle = {
    ...buttonStyle,
    textDecoration: "none",
    "@media (max-width: 640px)": {
      display: "none"
    }
  };

  const flexContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  const iconStyle = {
    height: "16px",
    width: "16px"
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={flexContainerStyle}>
          <span style={titleStyle}>Test Project</span>
        </div>

        <div style={flexContainerStyle}>
          <a
            href="https://github.com/chiragbadhe/test-project-js"
            target="_blank"
            rel="noopener noreferrer"
            style={githubLinkStyle}
          >
            <Github style={iconStyle} />
            <span>View on GitHub</span>
          </a>

          {isConnected ? (
            <div style={flexContainerStyle}>
              <button
                onClick={() => open()}
                style={buttonStyle}
              >
                <Wallet style={iconStyle} />
                <span>
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </button>
              <button
                onClick={() => disconnect()}
                style={buttonStyle}
              >
                <LogOut style={iconStyle} />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => open()}
              style={buttonStyle}
            >
              <Wallet style={iconStyle} />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
