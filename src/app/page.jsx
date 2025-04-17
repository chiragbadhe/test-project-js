"use client";

import { Header } from "../app/components/Header";
import { useDisconnect } from "@reown/appkit/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Timer, AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";

export default function Home() {
  const [isTimerSet, setIsTimerSet] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [sessionError, setSessionError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const intervalRef = useRef(undefined);
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const startCountdown = useCallback((initialTime) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const endTime = Date.now() + initialTime;

    intervalRef.current = setInterval(() => {
      const remaining = endTime - Date.now();

      if (remaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        handleSessionEnd();
        return;
      }

      setTimeRemaining(remaining);
    }, 1000);
  }, []);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/session", {
          credentials: 'include'
        });
        const data = await response.json();

        if (data.active && data.remainingTime > 0) {
          setIsTimerSet(true);
          setTimeRemaining(data.remainingTime);
          startCountdown(data.remainingTime);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      }
    };

    checkSession();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);

  const handleSetTimer = async () => {
    if (!isConnected) {
      setSessionError("Please connect your wallet first");
      return;
    }

    const minutes = inputRef.current?.value;
    if (!minutes || isNaN(Number(minutes)) || Number(minutes) <= 0) {
      setSessionError("Please enter a valid number of minutes");
      return;
    }

    try {
      setIsLoading(true);
      setSessionError(null);

      console.log("Starting session with minutes:", minutes);
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ minutes: Number(minutes) }),
      });

      const data = await response.json();
      console.log("Session response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to start timer");
      }

      setTimeRemaining(data.remainingTime);
      setIsTimerSet(true);
      startCountdown(data.remainingTime);
    } catch (error) {
      console.error("Timer setup failed:", error);
      setSessionError(error instanceof Error ? error.message : "Failed to start timer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionEnd = async () => {
    try {
      setIsLoading(true);
      setSessionError(null);

      const response = await fetch("/api/session", {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to end session");
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      disconnect();
      setIsTimerSet(false);
      setTimeRemaining(null);
    } catch (error) {
      console.error("Session end failed:", error);
      setSessionError(error instanceof Error ? error.message : "Failed to end session");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = () => {
    if (!timeRemaining) return "0:00";
    const minutes = Math.floor(timeRemaining / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const mainStyle = {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a"
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "120px",
    gap: "48px"
  };

  const headingContainerStyle = {
    maxWidth: "672px",
    textAlign: "center"
  };

  const headingStyle = {
    fontSize: "48px",
    fontWeight: "bold",
    background: "linear-gradient(to right, #3b82f6, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  };

  const subheadingStyle = {
    marginTop: "24px",
    fontSize: "20px",
    color: "#9ca3af"
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "448px",
    backgroundColor: "#111111",
    padding: "32px",
    border: "1px solid #1f1f1f",
    borderRadius: "12px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  };

  const cardHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px"
  };

  const cardTitleStyle = {
    fontSize: "24px",
    fontWeight: "600"
  };

  const errorStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "8px",
    color: "#ef4444",
    marginBottom: "24px"
  };

  const inputContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px"
  };

  const inputStyle = {
    flex: 1,
    padding: "12px 16px",
    backgroundColor: "#1f1f1f",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    color: "white"
  };

  const buttonStyle = {
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    color: "white"
  };

  const timerDisplayStyle = {
    textAlign: "center",
    padding: "16px",
    backgroundColor: "#1f1f1f",
    borderRadius: "8px",
    marginBottom: "24px"
  };

  const timerTextStyle = {
    fontSize: "24px",
    fontFamily: "monospace",
    color: "#3b82f6"
  };

  const timerSubtextStyle = {
    fontSize: "14px",
    color: "#9ca3af",
    marginTop: "8px"
  };

  const footerTextStyle = {
    fontSize: "14px",
    color: "#9ca3af"
  };

  return (
    <main style={mainStyle}>
      <Header />
      <div style={containerStyle}>
        <div style={headingContainerStyle}>
          <h1 style={headingStyle}>
            Welcome to Test Project
          </h1>
          <p style={subheadingStyle}>
            A place to create, mint, and shape your onchain identity.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <Timer style={{width: 24, height: 24, color: "#3b82f6"}} />
            <h2 style={cardTitleStyle}>Session Timer</h2>
          </div>

          <div>
            {sessionError && (
              <div style={errorStyle}>
                <AlertCircle style={{width: 20, height: 20}} />
                <span>{sessionError}</span>
              </div>
            )}

            <div>
              <div style={inputContainerStyle}>
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  placeholder="Enter minutes"
                  disabled={isTimerSet || isLoading || !isConnected}
                  style={inputStyle}
                />
                <button
                  disabled={isLoading || (!isConnected && !isTimerSet)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: isTimerSet ? "#ef4444" : "#3b82f6",
                    opacity: (isLoading || (!isConnected && !isTimerSet)) ? 0.5 : 1,
                    cursor: (isLoading || (!isConnected && !isTimerSet)) ? "not-allowed" : "pointer"
                  }}
                  onClick={() => {
                    if (isTimerSet) {
                      handleSessionEnd();
                    } else {
                      handleSetTimer();
                    }
                  }}
                >
                  {isLoading
                    ? "Processing..."
                    : isTimerSet
                    ? "End Session"
                    : "Start Session"}
                </button>
              </div>

              {isTimerSet && timeRemaining !== null && (
                <div style={timerDisplayStyle}>
                  <span style={timerTextStyle}>
                    {formatTimeRemaining()}
                  </span>
                  <p style={timerSubtextStyle}>
                    Session will end automatically
                  </p>
                </div>
              )}
            </div>

            <p style={footerTextStyle}>
              {!isConnected 
                ? "Please connect your wallet to start a session timer"
                : "Set a secure session timer to automatically disconnect your wallet. Your session is managed server-side with secure cookies."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
