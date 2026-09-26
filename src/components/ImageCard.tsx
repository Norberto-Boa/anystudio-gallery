import { Button, Card, CardMedia } from "@mui/material";
import type { DriveItem } from "../services/drive";
import DownloadIcon from "@mui/icons-material/Download";
import { downloadFileFromUrl } from "../utils/download";
// import { downloadFileFromUrl, openDownloadInNewTab } from "../utils/download";

interface ImageCardProps {
  image: DriveItem;
  previewUrl: string;
  downloadUrl: string;
  onOpen: () => void;
}



export function ImageCard({ previewUrl, downloadUrl, onOpen, image }: ImageCardProps) {
  return (
    <Card
      className="rounded-xl shadow break-inside-avoid cursor-pointer"
      onClick={onOpen}
    >
      <CardMedia
        component={"img"}
        height={"220"}
        className="object-cover"
        image={previewUrl}
        referrerPolicy="no-referrer"
      />

      <div className="flex justify-center pb-3">
        <Button
          type="button"
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={async (event) => {
            event.preventDefault()
            event.stopPropagation();

            await downloadFileFromUrl(downloadUrl, image.name);
          }}
        >
          Download
        </Button>
      </div>
    </Card>
  );
}
