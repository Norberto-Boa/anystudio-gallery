import { useEffect, useMemo, useState } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
  const [imageLoading, setImageLoading] = useState(false);

  const images = useMemo(() => {
    return items.filter((item) => item.mimeType.startsWith("image/"));
  }, [items]);

  const currentImageIndex = lightboxImage
    ? images.findIndex((image) => image.id === lightboxImage.id)
    : -1;

  const hasPreviousImage = currentImageIndex > 0;
  const hasNextImage = currentImageIndex < images.length - 1;

  function changeLightboxImage(image: DriveItem) {
    setImageLoading(true);
    setLightboxImage(image);
  }

  function goToPreviousImage() {
    if (!hasPreviousImage) return;

    changeLightboxImage(images[currentImageIndex - 1]);
  }

  function goToNextImage() {
    if (!hasNextImage) return;

    changeLightboxImage(images[currentImageIndex + 1]);
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

  useEffect(() => {
    if (!lightboxImage) return;

    const nextImage = hasNextImage ? images[currentImageIndex + 1] : null;
    const previousImage = hasPreviousImage
      ? images[currentImageIndex - 1]
      : null;

    [nextImage, previousImage].forEach((image) => {
      if (!image) return;

      const preload = new Image();
      preload.src = getImageUrl(image);
    });
  }, [lightboxImage, currentImageIndex, images]);

  // Fetch new contents when current folder changes
  useEffect(() => {
    if (!lightboxImage) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        setLightboxImage((currentImage) => {
          if (!currentImage) return currentImage;

          const index = images.findIndex(
            (image) => image.id === currentImage.id,
          );

          if (index <= 0) return currentImage;

          setImageLoading(true);
          return images[index - 1];
        });
      }

      if (event.key === "ArrowRight") {
        setLightboxImage((currentImage) => {
          if (!currentImage) return currentImage;

          const index = images.findIndex(
            (image) => image.id === currentImage.id,
          );

          if (index === -1 || index >= images.length - 1) {
            return currentImage;
          }

          setImageLoading(true);
          return images[index + 1];
        });
      }
      if (event.key === "Escape") {
        setLightboxImage(null);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxImage, images]);

  useEffect(() => {
    if (!lightboxImage) return;

    setImageLoading(true);
  }, [lightboxImage?.id]);

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
        maxWidth={false}
        fullScreen
        PaperProps={{
          className: "!bg-transparent !shadow-none !m-0 !overflow-hidden",
        }}
        BackdropProps={{
          className: "!bg-black/75 backdrop-blur-md",
        }}
      >
        {lightboxImage && (
          <div className="relative w-full h-dvh overflow-hidden">
            {/* Blurred background */}
            <img
              src={getImageUrl(lightboxImage)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-30"
              referrerPolicy="no-referrer"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content shell */}
            <div className="relative z-20 grid h-full grid-rows-[64px_1fr_64px] overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 md:px-6 overflow-hidden">
                <div className="min-w-0 pr-4 text-white text-sm md:text-base font-medium uppercase tracking-wide truncate">
                  {lightboxImage.name}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <IconButton
                    component="a"
                    href={
                      lightboxImage.webContentLink ?? getImageUrl(lightboxImage)
                    }
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="!w-11 !h-11 md:!w-12 md:!h-12 !text-white !bg-white/15 hover:!bg-white/25 !backdrop-blur-md"
                  >
                    <DownloadIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => setLightboxImage(null)}
                    className="!w-11 !h-11 md:!w-12 md:!h-12 !text-white !bg-white/10 hover:!bg-white/20 !border !border-white"
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>

              {/* Image zone */}
              <div className="relative min-h-0 overflow-hidden flex items-center justify-center px-4 md:px-24">
                {imageLoading && (
                  <div className="absolute inset-0 z-40 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/40 px-6 py-5 text-white backdrop-blur-md">
                      <CircularProgress size={34} className="!text-white" />
                      <span className="text-sm">Loading image...</span>
                    </div>
                  </div>
                )}

                {/* Previous arrow */}
                {hasPreviousImage && (
                  <IconButton
                    onClick={goToPreviousImage}
                    disabled={imageLoading}
                    className="!absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 !w-11 !h-11 md:!w-14 md:!h-14 !text-white !bg-black/40 hover:!bg-black/70 disabled:!opacity-40"
                  >
                    <ChevronLeftIcon fontSize="large" />
                  </IconButton>
                )}

                {/* Next arrow */}
                {hasNextImage && (
                  <IconButton
                    onClick={goToNextImage}
                    disabled={imageLoading}
                    className="!absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 !w-11 !h-11 md:!w-14 md:!h-14 !text-white !bg-black/40 hover:!bg-black/70 disabled:!opacity-40"
                  >
                    <ChevronRightIcon fontSize="large" />
                  </IconButton>
                )}

                <img
                  key={lightboxImage.id}
                  src={getImageUrl(lightboxImage)}
                  alt={lightboxImage.name}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                  className={`block max-w-full max-h-full object-contain rounded-lg md:rounded-xl shadow-2xl transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-center px-4 overflow-hidden">
                <button
                  type="button"
                  className="bg-white/15 hover:bg-white/25 text-white text-sm px-5 py-2 rounded-full backdrop-blur-md border border-white/20 transition"
                >
                  {currentImageIndex + 1} / {images.length}
                </button>
              </div>
            </div>
          </div>
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
                onClick={() => changeLightboxImage(item)}
              >
                <CardMedia
                  component="img"
                  height="220"
                  className="object-cover"
                  image={getPreviewUrl(item)}
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
