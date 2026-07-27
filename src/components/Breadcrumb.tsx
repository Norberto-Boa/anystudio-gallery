import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface BreadcrumbProps {
  title?: string;
  onBack: () => void;
}

export function Breadcrumb({
  onBack,
  title = "📸 Fotos da Liga Bancária",
}: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
        Back
      </Button>

      <span className="text-sm text-gray-500 truncate">{title}</span>
    </div>
  );
}
