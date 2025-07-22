import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { api } from "../../services/api";
import { LinkForm } from "./LinkForm";
import { SortableLink } from "./SortableLink";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { MdLogout } from "react-icons/md";
import { Profile } from "./Profile";

export interface LinkType {
  id: string;
  title: string;
  url: string;
  order: number;
  isPublic: boolean;
}

export function Dashboard() {
  const { user: authUser, logout } = useUser();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: links = [] } = useQuery<LinkType[]>({
    queryKey: ["links"],
    queryFn: async () => {
      const res = await api.get("/links");
      return res.data.sort((a: LinkType, b: LinkType) => a.order - b.order);
    },
  });

  const queryInvalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["links"] });

  const reorderMutation = useMutation({
    mutationFn: async (newOrder: string[]) =>
      api.patch("/links/reorder", { linkIds: newOrder }),
    onSuccess: queryInvalidate,
  });

  const createMutation = useMutation({
    mutationFn: async ({
      title,
      url,
      isPublic,
    }: {
      title: string;
      url: string;
      isPublic: boolean;
    }) => api.post("/links", { title, url, isPublic }),
    onSuccess: queryInvalidate,
  });

  const togglePublicMutation = useMutation({
    mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) =>
      api.patch(`/links/${id}/visibility`, { isPublic }),
    onSuccess: queryInvalidate,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Omit<LinkType, "order">) =>
      api.put(`/links/${data.id}`, data),
    onSuccess: () => {
      queryInvalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/links/${id}`),
    onSuccess: () => {
      queryInvalidate();
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((i) => i.id === active.id);
    const newIndex = links.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);
    queryClient.setQueryData(["links"], reordered);
    reorderMutation.mutate(reordered.map((i) => i.id));
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <Dialog open={isOpen || !!params.get("id")} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer" variant="outline">
              + New
            </Button>
          </DialogTrigger>
          <LinkForm
            onCreate={(title, url, isPublic) =>
              createMutation.mutate({ title, url, isPublic })
            }
            onUpdate={(id, title, url, isPublic) =>
              updateMutation.mutate({ id, title, url, isPublic })
            }
            afterClose={() => setIsOpen(false)}
          />
        </Dialog>
        <div className="flex items-center gap-3">
          {authUser?.user?.imgUrl && (
            <img
              src={authUser.user.imgUrl}
              alt="avatar"
              title="Profile"
              className="w-10 h-10 rounded-full border object-cover cursor-pointer"
              onClick={() => navigate(`/profile/${authUser.user.username}`)}
            />
          )}
          <MdLogout
            className="cursor-pointer hover:text-red-500"
            onClick={logout}
            size={24}
          />
        </div>
      </div>

      <Profile />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={links.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {links.map((link) => (
            <SortableLink
              key={link.id}
              link={link}
              onTogglePublic={(id, val) => {
                togglePublicMutation.mutate({ id, isPublic: val });
                queryClient.setQueryData(
                  ["links"],
                  links.map((l) => (l.id === id ? { ...l, isPublic: val } : l))
                );
              }}
              onEdit={(l) => {
                setParams({ id: l.id });
              }}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
