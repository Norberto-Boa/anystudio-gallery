import { useEffect, useState } from "react";
import { Card, CardActionArea, CardContent } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { fetchCollections } from "../services/drive";

interface Collection {
  id: string;
  name: string;
}

export default function Collections({
  onSelect,
}: {
  onSelect: (collection: Collection) => void;
}) {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    fetchCollections().then(data => setCollections(data.files));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📁 Collections</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {collections.map(col => (
          <Card
            key={col.id}
            className="rounded-2xl shadow hover:shadow-lg transition"
          >
            <CardActionArea onClick={() => onSelect(col)}>
              <div className="flex justify-center pt-6">
                <FolderIcon className="text-6xl text-blue-600" />
              </div>
              <CardContent className="text-center font-medium">
                {col.name}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  );
}
