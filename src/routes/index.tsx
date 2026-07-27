import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const rootFolderId = import.meta.env.VITE_DRIVE_ROOT_FOLDER_ID;

    if (!rootFolderId) {
      throw new Error("Missing VITE DRIVE ROOT FOLDER ID");
    }

    throw redirect({
      to: "/gallery/$folderId",
      params: {
        folderId: rootFolderId,
      },
    });
  },
});
