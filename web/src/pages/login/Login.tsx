import { FcGoogle } from "react-icons/fc";
import { Button } from "../../components/ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../services/firebase";
import { api } from "../../services/api";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";

export function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    const userCredentials = await signInWithPopup(auth, provider);
    const idToken = await userCredentials.user.getIdToken();
    const { data } = await api.post("/auth/firebase", { idToken });
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome</h1>
        <p className="text-gray-500 mb-8">Sign in to continue</p>
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
