"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignIn = async () => {
    const response = await fetch("http://localhost:3001/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.token) {
      console.error("Failed to sign in:", data.message || "Unknown error");
      clearFields();
      return;
    }

    console.log("Received token:", data.token);
    localStorage.setItem("token", data.token);
    clearFields();
    console.log("Signed in successfully");
    redirect("/rooms");
  };

  const handleSignUp = async () => {
    const response = await fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
        name: name,
      }),
    });
    if (!response.ok) {
      console.log("Failed to sign up");
      clearFields();
      return;
    }
    const user = await response.json();
    localStorage.setItem("userId", user.userId);
    console.log("Signed up successfully");
    clearFields();
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-6 m-2 bg-white rounded">
        <div className="p-2">
          <input
            type="text"
            value={name}
            placeholder="Name"
            className={`${isSignin === true ? "hidden" : ""}`}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="p-2">
          <input
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>
        <div className="p-2">
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>

        <div className="pt-2">
          <button
            className="bg-red-200 rounded p-2"
            onClick={() => {
              if (isSignin) {
                console.log("Signing in...");
                handleSignIn();
              } else {
                console.log("Signing up...");
                handleSignUp();
              }
            }}
          >
            {isSignin ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
