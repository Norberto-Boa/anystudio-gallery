import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { DriveItem } from "../services/drive";
import { CircularProgress, Dialog, IconButton } from "@mui/material";

interface LightboxProps {
  image: DriveItem | null;
  imagesCount: number;
  currentImageIndex: number;
  imageLoading: boolean;
  hasPreviousImage: boolean;
  hasNextImage: boolean;
  imageUrl: string | null;
  downloadUrl: string | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onImageLoad: () => void;
  onImageError: () => void;
}

export function Lightbox({
  image,
  imagesCount,
  currentImageIndex,
  imageLoading,
  hasPreviousImage,
  hasNextImage,
  imageUrl,
  downloadUrl,
  onClose,
  onPrevious,
  onNext,
  onImageLoad,
  onImageError,
}: LightboxProps) {
  return (
    <Dialog
      open={!!image}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        className: "!bg-transparent !shadow-none !m-0 !overflow-hidden",
        sx: {
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
        },
      }}
      BackdropProps={{
        className: "!bg-black/75 backdrop-blur-md",
      }}
    >
      {image && imageUrl && (
        <div className="relative w-full h-full min-h-screen overflow-hidden">
          {/* Blurred background */}
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-30"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content shell */}
          <div className="relative z-20 grid h-full grid-rows-[64px_1fr_64px] overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 md:px-6 overflow-hidden">
              <div className="min-w-0 pr-4 text-white text-sm md:text-base font-medium uppercase tracking-wide truncate">
                {image.name}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {downloadUrl && (
                  <IconButton
                    component="a"
                    href={downloadUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="!w-11 !h-11 md:!w-12 md:!h-12 !text-white !bg-white/15 hover:!bg-white/25 !backdrop-blur-md"
                  >
                    <DownloadIcon />
                  </IconButton>
                )}

                <IconButton
                  onClick={onClose}
                  className="!w-11 !h-11 md:!w-12 md:!h-12 !text-white !bg-white/10 hover:!bg-white/20 !border !border-white"
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>

            {/* Image zone */}
            <div className="relative min-h-0 h-full overflow-hidden flex items-center justify-center px-4 md:px-24">
              {imageLoading && (
                <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/40 px-6 py-5 text-white backdrop-blur-md">
                    <CircularProgress size={34} className="!text-white" />
                    <span className="text-sm">Loading image...</span>
                  </div>
                </div>
              )}

              {hasPreviousImage && (
                <IconButton
                  onClick={onPrevious}
                  disabled={imageLoading}
                  className="!absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 !w-11 !h-11 md:!w-14 md:!h-14 !text-white !bg-black/40 hover:!bg-black/70 disabled:!opacity-40"
                >
                  <ChevronLeftIcon fontSize="large" />
                </IconButton>
              )}

              {hasNextImage && (
                <IconButton
                  onClick={onNext}
                  disabled={imageLoading}
                  className="!absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 !w-11 !h-11 md:!w-14 md:!h-14 !text-white !bg-black/40 hover:!bg-black/70 disabled:!opacity-40"
                >
                  <ChevronRightIcon fontSize="large" />
                </IconButton>
              )}

              <img
                key={image.id}
                src={imageUrl}
                alt={image.name}
                onLoad={onImageLoad}
                onError={onImageError}
                className={`block w-auto h-auto max-w-full max-h-full object-contain rounded-lg md:rounded-xl shadow-2xl transition-opacity duration-300 ${
                  imageLoading ? "opacity-30" : "opacity-100"
                }`}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom counter */}
            <div className="flex items-center justify-center px-4 overflow-hidden">
              <button
                type="button"
                className="bg-white/15 hover:bg-white/25 text-white text-sm px-5 py-2 rounded-full backdrop-blur-md border border-white/20 transition"
              >
                {currentImageIndex + 1} / {imagesCount}
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
