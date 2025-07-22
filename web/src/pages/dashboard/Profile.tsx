import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../context/user-context";
import { api } from "../../services/api";
import { debounce } from "lodash";
import { useUser } from "../../hooks/useUser";

interface ProfileUpdateData {
  username: string;
  name?: string;
  description?: string;
}

export function Profile() {
  const queryClient = useQueryClient();
  const { updateUser } = useUser();
  const { data: user } = useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/me");
      return res.data;
    },
  });

  const mutate = useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      await api.put("/profile", data);
      // Optionally, you can refetch the user data or update the context state here
    },
    onSuccess: () => {
      // Optionally, you can refetch the user data or update the context state here
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const handleEditProfile = debounce(
    async (data: Partial<ProfileUpdateData>) => {
      if (user) {
        const userData = {
          username: user.username,
          name: user.name,
          description: user.description,
          ...data,
        };
        mutate.mutate(userData);
        updateUser(userData);
      }
    },
    1000 // 1 second debounce
  );

  if (!user) return null;

  return (
    <div className="space-y-2 mb-2">
      <div className="flex gap-2">
        <div>
          <label className="text-sm" htmlFor="username">
            Login
          </label>
          <input
            className="w-full border-2 p-1 rounded-md text-sm"
            type="text"
            name="username"
            id="username"
            defaultValue={user?.username}
            onChange={(e) => handleEditProfile({ username: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm" htmlFor="name">
            Name
          </label>
          <input
            className="w-full border-2 p-1 rounded-md text-sm"
            type="text"
            name="name"
            id="name"
            defaultValue={user?.name}
            onChange={(e) => handleEditProfile({ name: e.target.value })}
          />
        </div>
      </div>
      <label className="text-sm" htmlFor="description">
        Who I am?
      </label>
      <textarea
        className="w-full border-2 rounded-md p-1 text-sm"
        name="description"
        id="description"
        defaultValue={user?.description}
        onChange={(e) => handleEditProfile({ description: e.target.value })}
      />
    </div>
  );
}
