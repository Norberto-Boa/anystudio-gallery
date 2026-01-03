import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Dialog,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { fetchFolderContents } from "../services/drive";
import FolderCard from "./FolderCard";

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

export default function FolderExplorer({
  rootFolderId,
}: {
  rootFolderId: string;
}) {
  const [stack, setStack] = useState<DriveItem[]>([]); // Important for navigation, determines current folder!
  const [items, setItems] = useState<DriveItem[]>([]); // Current folder items
  const [loading, setLoading] = useState(true); 
  const [lightboxImage, setLightboxImage] = useState<DriveItem | null>(null);

  // Determine current folder ID based on stack
  const currentFolderId =
    stack.length === 0 ? rootFolderId : stack[stack.length - 1].id; 

  // Fetch new contents when current folder changes
  useEffect(() => {
    load();
  }, [currentFolderId]);

  async function load() {
    setLoading(true);
    const data = await fetchFolderContents(currentFolderId);
    setItems(data.files);
    setLoading(false);
  }

  function enterFolder(folder: DriveItem) {
    setStack((prev) => [...prev, folder]);
  }

  function goBack() {
    setStack((prev) => prev.slice(0, -1));
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Dialog
        open={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        maxWidth="lg"
        className="overflow-hidden"
        scroll="body"
      >
        {lightboxImage && (
          <img
            src={`https://www.googleapis.com/drive/v3/files/${
              lightboxImage.id
            }?alt=media&key=${import.meta.env.VITE_GOOGLE_API_KEY}`}
            className="max-h-[90vh] max-w-full object-contain"
          />
        )}
      </Dialog>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        {stack.length > 0 && (
          <Button startIcon={<ArrowBackIcon />} onClick={goBack}>
            Back
          </Button>
        )}

        <span className="text-sm text-gray-500">
          {stack.map((f) => f.name).join(" / ") || "📸Fotos da Liga Bancaria"}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <CircularProgress />
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {items.map((item) => {
            const isFolder =
              item.mimeType === "application/vnd.google-apps.folder";

              // Check if is folder, render folderCard 
            if (isFolder) {
              return (
                <FolderCard folder={item} onClick={() => enterFolder(item)} />
              );
            }

            // Image
            return (
              <Card
                key={item.id}
                className="rounded-xl shadow break-inside-avoid"
                 onClick={() => setLightboxImage(item)}
              >
                <CardMedia
                  component="img"
                  height="220"
                  className="object-cover"
                  image={
                    item.thumbnailLink
                      ? item.thumbnailLink.replace("=s220", "=s800")
                      : `https://www.googleapis.com/drive/v3/files/${
                          item.id
                        }?alt=media&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
                  }
                />

                <CardContent className="text-sm truncate text-center font-medium">
                  {item.name}
                </CardContent>

                <div className="flex justify-center pb-3">
                  <Button
                    type="button"
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    href={item.webContentLink ?? ""}
                    download
                  >
                    Download
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
