// import { useEffect, useState } from "react";
// import {
//   Button,
//   Card,
//   CardActions,
//   CardMedia,
//   CircularProgress,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import DownloadIcon from "@mui/icons-material/Download";
// // import { fetchImagesFromFolder } from "../services/drive";

// export default function CollectionGallery({
//   collection,
//   onBack,
// }: {
//   collection: { id: string; name: string };
//   onBack: () => void;
// }) {
//   const [photos, setPhotos] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     load();
//   }, [collection.id]);

//   async function load() {
//     setLoading(true);
//     const data = await fetchImagesFromFolder(collection.id);
//     setPhotos(data.files);
//     setLoading(false);
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <Button
//         startIcon={<ArrowBackIcon />}
//         onClick={onBack}
//         className="mb-6"
//       >
//         Back to collections
//       </Button>

//       <h2 className="text-xl font-bold mb-6">{collection.name}</h2>

//       {loading ? (
//         <div className="flex justify-center mt-20">
//           <CircularProgress />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {photos.map(photo => (
//             <Card key={photo.id} className="rounded-xl shadow">
//               <CardMedia
//                 component="img"
//                 height="220"
//                 image={
//                   photo.thumbnailLink
//                     ? photo.thumbnailLink.replace("=s220", "=s800")
//                     : `https://www.googleapis.com/drive/v3/files/${photo.id}?alt=media&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
//                 }
//               />

//               <CardActions className="justify-center bg-gray-50">
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
//     </div>
//   );
// }
