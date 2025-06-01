import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { GoXCircle } from "react-icons/go";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { DialogClose, DialogContent } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { linkFormSchema, type LinkFormSchema } from "../../schemas/Link";
import { api } from "../../services/api";
import { useEffect } from "react";

interface Props {
  onCreate: (title: string, url: string, isPublic: boolean) => void;
  onUpdate: (id: string, title: string, url: string, isPublic: boolean) => void;
  afterClose?: () => void;
}

export function LinkForm({ onCreate, onUpdate, afterClose }: Props) {
  const [params, setParams] = useSearchParams();
  const id = params.get("id");
  const { data } = useQuery<LinkFormSchema>({
    queryKey: ["link-id"],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/links/${id}`);
      return res.data;
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(linkFormSchema),
  });
  const isPublic = watch("isPublic");

  useEffect(() => {
    if (id && data) {
      reset(data); // Edit mode: reset with existing data
    } else if (!id) {
      reset({
        title: "",
        url: "",
        isPublic: false,
      }); // Create mode: reset with empty values
    }
  }, [id, data, reset]);

  function onClose() {
    const newParams = new URLSearchParams(params);
    newParams.delete("id");
    setParams(newParams);
    afterClose?.();
  }

  return (
    <DialogContent showCloseButton={false}>
      <DialogClose className="absolute top-4 right-4">
        <GoXCircle className="cursor-pointer" onClick={onClose} />
      </DialogClose>
      <div className="flex flex-col gap-4 p-4">
        <Input
          placeholder="Title"
          {...register("title")}
          error={errors.title?.message}
        />
        <Input
          placeholder="https://example.com"
          {...register("url")}
          error={errors.url?.message}
        />
        <div className="flex items-center gap-2">
          <Switch
            checked={isPublic}
            onCheckedChange={() => setValue("isPublic", !isPublic)}
          />
          <span className="text-sm">Public</span>
        </div>
        <Button
          className="cursor-pointer"
          onClick={handleSubmit((data) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            id
              ? onUpdate(id, data.title, data.url, data.isPublic)
              : onCreate(data.title, data.url, data.isPublic);
            onClose();
          })}
        >
          {id ? "Update" : "Create"}
        </Button>
      </div>
    </DialogContent>
  );
}
