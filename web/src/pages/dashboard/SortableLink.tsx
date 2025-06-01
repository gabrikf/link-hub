import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Switch } from "../../components/ui/switch";

interface LinkType {
  id: string;
  title: string;
  url: string;
  order: number;
  isPublic: boolean;
}

interface Props {
  link: LinkType;
  onTogglePublic: (id: string, newValue: boolean) => void;
  onEdit: (link: LinkType) => void;
  onDelete: (id: string) => void;
}

export function SortableLink({
  link,
  onTogglePublic,
  onEdit,
  onDelete,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between gap-4 p-3 rounded-md border mb-2 bg-white shadow-sm"
    >
      <div {...listeners} className="cursor-grab pr-2 w-8 text-center">
        ::
      </div>

      <div className="flex-1">
        <p className="font-semibold">{link.title}</p>
        <Link to={link.url} target="_blank" className="text-sm text-gray-600">
          {link.url.length > 30 ? link.url.slice(0, 30) + "..." : link.url}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onEdit(link)}
          className="text-gray-600 hover:text-blue-600 cursor-pointer"
          title="Edit"
        >
          <FiEdit2 />
        </button>
        <button
          onClick={() => onDelete(link.id)}
          className="text-gray-600 hover:text-red-600 cursor-pointer"
          title="Edit"
        >
          <FiTrash />
        </button>
        <Switch
          className="cursor-pointer"
          checked={link.isPublic}
          onCheckedChange={(checked) => onTogglePublic(link.id, checked)}
        />
      </div>
    </div>
  );
}
