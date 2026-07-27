import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { fetchFolderContents } from "../services/drive";
import FolderCard from "./FolderCard";
import { useNavigate } from "@tanstack/react-router";

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

interface FolderExplorerProps {
  folderId: string;
}

export default function FolderExplorer({ folderId }: FolderExplorerProps) {
  const navigate = useNavigate();

  const [items, setItems] = useState<DriveItem[]>([]); // Current folder items
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<DriveItem | null>(null);

  const images = items.filter(
    (item) =>
      item.mimeType.startsWith("image/") ||
      item.thumbnailLink ||
      item.webContentLink,
  );

  const currentImageIndex = lightboxImage
    ? images.findIndex((image) => image.id === lightboxImage.id)
    : -1;

  const hasPreviouseImage = currentImageIndex > 0;
  const hasNextImage = currentImageIndex < images.length - 1;

  function goToPreviousImage() {
    if (!hasPreviouseImage) return;

    setLightboxImage(images[currentImageIndex - 1]);
  }

  function goToNextImage() {
    if (!hasNextImage) return;

    setLightboxImage(images[currentImageIndex + 1]);
  }

  function getImageUrl(image: DriveItem) {
    return `https://www.googleapis.com/drive/v3/files/${image.id}?alt=media&key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }`;
  }

  function getPreviewUrl(image: DriveItem) {
    return image.thumbnailLink
      ? image.thumbnailLink.replace("=s220", "=s800")
      : getImageUrl(image);
  }

  const currentFolderId = folderId;

  // Fetch new contents when current folder changes
  useEffect(() => {
    load();
  }, [currentFolderId]);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchFolderContents(currentFolderId);
      setItems(data.files ?? []);
    } catch (error) {
      console.error("Erro ao carregar pasta:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  function enterFolder(folder: DriveItem) {
    navigate({
      to: "/gallery/$folderId",
      params: {
        folderId: folder.id,
      },
    });
  }

  function goBack() {
    window.history.back();
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
        <Button startIcon={<ArrowBackIcon />} onClick={goBack}>
          Back
        </Button>

        <span className="text-sm text-gray-500">
          {"📸Fotos da Liga Bancaria"}
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
                <FolderCard
                  folder={item}
                  onClick={() => enterFolder(item)}
                  key={item.id}
                />
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
                  referrerPolicy="no-referrer"
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
