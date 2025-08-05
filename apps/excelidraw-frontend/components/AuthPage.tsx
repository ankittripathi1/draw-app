"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { Button, Input, Label } from "@/components/ui";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignIn = async () => {
    const response = await fetch("http://localhost:8001/signin", {
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
    const response = await fetch("http://localhost:8001/signup", {
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
    <div className="w-screen h-screen flex justify-center items-center bg-white dark:bg-transparent">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isSignin ? "Sign in to your account" : "Create an account"}
          </h1>
        </div>
        <div className="space-y-6">
          {!isSignin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                placeholder="Your name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              placeholder="email@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              if (isSignin) {
                handleSignIn();
              } else {
                handleSignUp();
              }
            }}
          >
            {isSignin ? "Sign in" : "Sign up"}
          </Button>
        </div>
      </div>
    </div>
  );
}
