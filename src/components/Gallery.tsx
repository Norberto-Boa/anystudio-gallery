// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardActions,
//   CardMedia,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";
// import { fetchImages } from "../services/drive";

// interface Photo {
//   id: string;
//   name: string;
//   thumbnailLink: string;
//   webContentLink: string;
// }

// export default function Gallery() {
//   const [photos, setPhotos] = useState<Photo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [nextPageToken, setNextPageToken] = useState<string | null>(null);

// function getImageUrl(file: any) {
//   if (file.thumbnailLink) {
//     return file.thumbnailLink.replace("=s220", "=s800");
//   }

//   return `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
// }

//   useEffect(() => {
//     loadPhotos();
//   }, []);

//   async function loadPhotos(token?: string) {
//     setLoading(true);
//     try {
//       const data = await fetchImages(token);
//       setPhotos(prev => [...prev, ...data.files]);
//       setNextPageToken(data.nextPageToken ?? null);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">📸 Photo Gallery</h1>

//       {loading && photos.length === 0 ? (
//         <div className="flex justify-center mt-20">
//           <CircularProgress />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {photos.map(photo => (
//             <Card
//               key={photo.id}
//               className="rounded-2xl shadow-md hover:shadow-xl transition"
//             >
//               <CardMedia
//   component="img"
//   height="220"
//   image={getImageUrl(photo)}
//   alt={photo.name}
//   className="object-cover"
// />

//               <CardActions className="flex justify-center bg-gray-50">
//                 <Button
//                   size="small"
//                   variant="contained"
//                   startIcon={<DownloadIcon />}
//                   href={photo.webContentLink}
//                   download
//                 >
//                   Download
//                 </Button>
//               </CardActions>
//             </Card>
//           ))}
//         </div>
//       )}

//       {nextPageToken && (
//         <div className="flex justify-center mt-10">
//           <Button
//             variant="outlined"
//             onClick={() => loadPhotos(nextPageToken)}
//             disabled={loading}
//           >
//             {loading ? "Loading..." : "Load more"}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
