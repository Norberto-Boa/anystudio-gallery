const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  resourceKey?: string;
}

interface DriveResponse {
  files?: DriveItem[];
  nextPageToken?: string;
}

export async function fetchFolderContents(
  folderId: string,
  resourceKey?: string,
): Promise<DriveResponse> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents`,
    fields:
      "nextPageToken,files(id,name,mimeType,thumbnailLink,webContentLink)",
    pageSize: "300",
    orderBy: "name desc",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
    key: API_KEY,
  });

  if (resourceKey) params.append("resourceKey", resourceKey);

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
  );

  if (!res.ok) throw new Error("Failed to fetch folder contents");

  return res.json();
}

export async function fetchFolderCover(
  folderId: string,
  resourceKey?: string,
): Promise<DriveItem | null> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: "files(id,thumbnailLink, mimeType,webContentLink)",
    pageSize: "1",
    orderBy: "createdTime desc",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
    key: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  if (resourceKey) {
    params.set("resourceKey", resourceKey);
  }

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch folder cover");
  }

  const data = await res.json();
  return data.files?.[0] ?? null;
}
