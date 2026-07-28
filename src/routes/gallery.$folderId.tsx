import { createFileRoute } from "@tanstack/react-router";
import FolderExplorer from "../components/FolderExplorer";

type GallerySearch = {
  resourceKey?: string;
};

export const Route = createFileRoute("/gallery/$folderId")({
  validateSearch: (search: Record<string, unknown>): GallerySearch => {
    return {
      resourceKey:
        typeof search.resourceKey === "string" ? search.resourceKey : undefined,
    };
  },
  component: GalleryPage,
});

function GalleryPage() {
  const { folderId } = Route.useParams();
  const { resourceKey } = Route.useSearch();

  return <FolderExplorer folderId={folderId} resourceKey={resourceKey} />;
}
