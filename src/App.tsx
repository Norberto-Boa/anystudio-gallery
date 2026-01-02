import { useState } from "react";
import Collections from "./components/Collections";
import CollectionGallery from "./components/CollectionGallery";
import FolderExplorer from "./components/FolderExplorer";

export default function App() {
  const [selectedCollection, setSelectedCollection] =
    useState<any>(null);

  // if (!selectedCollection) {
  //   return <Collections onSelect={setSelectedCollection} />;
  // }

  return (
    <FolderExplorer
      rootFolderId={import.meta.env.VITE_DRIVE_ROOT_FOLDER_ID}
    />
  );
}
