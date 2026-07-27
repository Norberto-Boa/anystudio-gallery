import { useEffect, useState } from "react";
import { Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { fetchFolderCover } from "../services/drive";

interface DriveCover {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

interface Props {
  folder: {
    id: string;
    name: string;
  };
  onClick: () => void;
}

export default function FolderCard({ folder, onClick }: Props) {
  const [cover, setCover] = useState<DriveCover | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadCover() {
      try {
        setLoading(true);

        const img = await fetchFolderCover(folder.id);

        if (!active) return;

        setCover(img);
      } catch (error) {
        console.error("Erro ao carregar preview da pasta: ", error);

        if (!active) return;

        setCover(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCover();

    return () => {
      active = false;
    };

    // fetchFolderCover(folder.id).then((img) => {
    //   setCover(img);
    //   setLoading(false);
    // });
  }, [folder.id]);

  const coverImageUrl = cover?.thumbnailLink
    ? cover.thumbnailLink.replace("=s220", "=s800")
    : cover?.id
      ? `https://www.googleapis.com/drive/v3/files/${cover.id}?alt=media&key=${
          import.meta.env.VITE_GOOGLE_API_KEY
        }`
      : null;

  return (
    <Card className="rounded-2xl shadow hover:shadow-lg transition">
      <CardActionArea onClick={onClick}>
        {coverImageUrl ? (
          <CardMedia
            component="img"
            height="160"
            image={coverImageUrl}
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex justify-center items-center h-40 bg-gray-100">
            {loading ? (
              <div className="animate-pulse w-full h-full bg-gray-200" />
            ) : (
              <FolderIcon className="text-6xl text-blue-800" />
            )}
          </div>
        )}

        <CardContent className="text-center font-medium truncate">
          {folder.name}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
