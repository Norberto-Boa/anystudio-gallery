import { useEffect, useState } from "react";
import { Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { fetchFolderCover } from "../services/drive";

interface Props {
  folder: {
    id: string;
    name: string;
  };
  onClick: () => void;
}

export default function FolderCard({ folder, onClick }: Props) {
  const [cover, setCover] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolderCover(folder.id).then(img => {
      setCover(img);
      setLoading(false);
    });
  }, [folder.id]);

  return (
    <Card className="rounded-2xl shadow hover:shadow-lg transition">
      <CardActionArea onClick={onClick}>
        {cover ? (
          <CardMedia
            component="img"
            height="160"
            image={cover.thumbnailLink.replace("=s220", "=s800")}
            className="object-cover"
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
