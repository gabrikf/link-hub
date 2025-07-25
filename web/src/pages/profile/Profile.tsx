import { useQuery } from "@tanstack/react-query";

import type { LinkType } from "../dashboard/Dashboard";
import { Header } from "./Header";
import { api } from "../../services/api";
import { LinkCard } from "./LinkCard";
import { useParams } from "react-router-dom";

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data: profile } = useQuery<{
    username: string;
    name?: string;
    description?: string;
    userPhoto: string;
    links: LinkType[];
  }>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get(`/profile/${username}`);
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <Header />

      <main className="flex flex-col items-center mt-10 w-full px-4">
        {profile?.userPhoto && (
          <img
            src={profile.userPhoto}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white"
          />
        )}
        <h2 className="text-2xl font-bold mt-4">{profile?.name}</h2>
        <h4 className="text-sm font-bold">(@{profile?.username})</h4>
        <div className="text-center mt-2 max-w-md italic text-sm">
          <p>{profile?.description}</p>
        </div>

        <div className="mt-8 flex flex-col items-center w-full">
          {profile?.links?.map((link: LinkType) => (
            <LinkCard key={link.id} title={link.title} url={link.url} />
          ))}
        </div>
      </main>
    </div>
  );
}
