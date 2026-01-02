const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export async function fetchFolderContents(
  folderId: string,
  pageToken?: string
) {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents`,
    fields:
      "nextPageToken,files(id,name,mimeType,thumbnailLink,webContentLink)",
    pageSize: "100",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
    key: API_KEY,
  });

  if (pageToken) params.append("pageToken", pageToken);

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`
  );

  if (!res.ok) throw new Error("Failed to fetch folder contents");

  return res.json();
}

export async function fetchFolderCover(folderId: string) {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and mimeType contains 'image/'`,
    fields: "files(id,thumbnailLink)",
    pageSize: "1",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
    key: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params}`
  );

  const data = await res.json();
  return data.files?.[0] ?? null;
}
