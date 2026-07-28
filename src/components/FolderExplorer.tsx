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
import { fetchFolderContents, type DriveItem } from "../services/drive";
import FolderCard from "./FolderCard";
import { useNavigate } from "@tanstack/react-router";
import { Lightbox } from "./Lightbox";
import { Breadcrumb } from "./Breadcrumb";
import { ImageCard } from "./ImageCard";

// interface DriveItem {
//   id: string;
//   name: string;
//   mimeType: string;
//   thumbnailLink?: string;
//   webContentLink?: string;
// }

interface FolderExplorerProps {
  folderId: string;
  resourceKey?: string;
}

export default function FolderExplorer({
  folderId,
  resourceKey,
}: FolderExplorerProps) {
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

  const currentFolderId = folderId;

  useEffect(() => {
    load();
  }, [currentFolderId, resourceKey]);

  useEffect(() => {
    if (!lightboxImage) return;

    setImageLoading(true);
  }, [lightboxImage?.id]);

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
    const params = new URLSearchParams({
      alt: "media",
      key: import.meta.env.VITE_GOOGLE_API_KEY,
    });

    if (image.resourceKey) {
      params.set("resourceKey", image.resourceKey);
    }

    return `https://www.googleapis.com/drive/v3/files/${image.id}?${params.toString()}`;
  }

  function getPreviewUrl(image: DriveItem) {
    return image.thumbnailLink
      ? image.thumbnailLink.replace("=s220", "=s800")
      : getImageUrl(image);
  }

  async function load() {
    try {
      setLoading(true);

      const data = await fetchFolderContents(currentFolderId, resourceKey);

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
      search: folder.resourceKey
        ? {
            resourceKey: folder.resourceKey,
          }
        : {},
    });
  }

  function goBack() {
    window.history.back();
  }

  function openLightbox(image: DriveItem) {
    setLightboxImage(image);
  }

  function closeLightBox() {
    setLightboxImage(null);
    setImageLoading(false);
  }

  function getThumbnailUrl(image: DriveItem) {
    return image.thumbnailLink
      ? image.thumbnailLink.replace("=s220", "=s1600")
      : getImageUrl(image);
  }

  function getDownloadUrl(image: DriveItem) {
    return image.webContentLink ?? getImageUrl(image);
  }

  const lightboxImageUrl = lightboxImage
    ? getThumbnailUrl(lightboxImage)
    : null;

  const lightboxDownloadUrl = lightboxImage
    ? getDownloadUrl(lightboxImage)
    : null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Lightbox
        image={lightboxImage}
        imagesCount={images.length}
        currentImageIndex={currentImageIndex}
        imageLoading={imageLoading}
        hasPreviousImage={hasPreviousImage}
        hasNextImage={hasNextImage}
        imageUrl={lightboxImageUrl}
        downloadUrl={lightboxDownloadUrl}
        onClose={closeLightBox}
        onPrevious={goToPreviousImage}
        onNext={goToNextImage}
        onImageLoad={() => setImageLoading(false)}
        onImageError={() => setImageLoading(false)}
      />

      {/* Breadcrumb */}
      <Breadcrumb onBack={goBack} />

      {loading ? (
        <div className="flex justify-center mt-20">
          <CircularProgress />
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {items.map((item) => {
            const isFolder =
              item.mimeType === "application/vnd.google-apps.folder";

            if (isFolder) {
              return (
                <FolderCard
                  key={item.id}
                  folder={item}
                  onClick={() => enterFolder(item)}
                />
              );
            }

            if (!item.mimeType.startsWith("image/")) {
              return null;
            }

            return (
              <ImageCard
                key={item.id}
                image={item}
                previewUrl={getThumbnailUrl(item)}
                downloadUrl={getDownloadUrl(item)}
                onOpen={() => openLightbox(item)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
