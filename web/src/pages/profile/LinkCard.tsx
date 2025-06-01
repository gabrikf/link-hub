import { Link } from "react-router-dom";

interface LinkCardProps {
  title: string;
  url: string;
}

export function LinkCard({ title, url }: LinkCardProps) {
  return (
    <Link
      to={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full max-w-md bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg rounded-2xl px-6 py-4 mb-4 hover:scale-105 transition-transform shadow-lg"
    >
      {title}
    </Link>
  );
}
