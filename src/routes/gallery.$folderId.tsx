import { createFileRoute } from "@tanstack/react-router";
import FolderExplorer from "../components/FolderExplorer";

export const Route = createFileRoute("/gallery/$folderId")({
  component: GalleryPage,
});

function GalleryPage() {
  const { folderId } = Route.useParams();

  return <FolderExplorer folderId={folderId} />;
}
