import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";


const Landing = () => {
  const [showHeading, setShowHeading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Show heading first, then transition to login modal after 3 seconds
    const timer = setTimeout(() => {
      setShowHeading(false);
      // Add a small delay after heading disappears before showing modal
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    if (email && password) {
      if (email === "harsha.j@keyvalue.systems" || email === "sarath.ms@keyvalue.systems") {
        navigate("/admin");
      } else {
        navigate("/mood");
      }
    }
  };

  const handleGoogleLogin = () => {
    // Simulate Google login - redirect to employee dashboard
    navigate("/mood");
  };

  return (
    <div className="min-h-screen grainy-bg flex items-center justify-center relative overflow-hidden">
      {/* Main heading */}
      {showHeading && (
        <h1 className={`text-6xl md:text-8xl font-dancing text-vibe-warm-brown text-center fade-in ${!showHeading ? 'fade-out' : ''}`}>
          What is your vibe today?
        </h1>
      )}

      {/* Login Modal */}
      {showModal && (
        <div className="glass-modal rounded-3xl p-8 w-full max-w-md mx-4 slide-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-dancing text-vibe-warm-brown mb-2">Welcome to Vibe</h2>
            <p className="text-muted-foreground">Sign in to track your mood</p>
          </div>

          <div className="space-y-6">


            <div className="space-y-2">
              <Label htmlFor="email" className="text-vibe-warm-brown">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-vibe-glass-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-vibe-warm-brown">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-vibe-glass-border"
              />
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white font-medium py-3 rounded-xl transition-all duration-300"
            >
              Log In
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-vibe-glass-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full bg-background/50 border-vibe-glass-border hover:bg-accent/50 py-3 rounded-xl transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;