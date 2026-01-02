import FolderExplorer from "./components/FolderExplorer";

export default function App() {

  // if (!selectedCollection) {
  //   return <Collections onSelect={setSelectedCollection} />;
  // }

  return (
    <FolderExplorer
      rootFolderId={import.meta.env.VITE_DRIVE_ROOT_FOLDER_ID}
    />
  );
}
