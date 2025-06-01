import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useUser } from "../../hooks/useUser";

export function Header() {
  const { user } = useUser();
  return (
    <header className="w-full flex justify-end items-center px-6 py-4 shadow-sm bg-gray-50 sticky top-0 z-10">
      <Link to={user ? "/dashboard" : "/login"}>
        <Button className="cursor-pointer bg-gray-100" variant="outline">
          {user ? "Dashboard" : "Login"}
        </Button>
      </Link>
    </header>
  );
}
