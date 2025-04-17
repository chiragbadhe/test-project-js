// context/index.jsx
"use client";

import { wagmiAdapter, projectId } from "../config/reown";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { base } from "@reown/appkit/networks";
import React from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Test Project",
  description: "A test project for development and testing.",
  url: "https://test-project.local",
  icons: ["https://test-project.local/logo.png"],
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
  metadata: metadata,
  themeVariables: {
    "--w3m-border-radius-master": "2px",
  },
  features: {
    analytics: true,
  },
});

function ContextProvider({ children, cookies }) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
