import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginPage = () => {
  const { signIn, signUp, authUser } = useApp();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in go to products page
  if (authUser) {
    navigate("/home");
    return null;
  }

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Fill all fields");
      return;
    }

    setSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(email, password, name);
        toast.success("Account created! Please check your email.");
      } else {
        await signIn(email, password);
        toast.success("Welcome back!");
        navigate("/home");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <span className="text-5xl block mb-3">🥬</span>

          <h1 className="font-display font-bold text-2xl text-foreground">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp
              ? "Sign up to start ordering"
              : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 card-elevated space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-medium underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;