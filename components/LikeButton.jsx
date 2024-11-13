import { TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { databases, DATABASES, COLLECTIONS } from "../lib/appwrite";

export default function LikeButton({ artworkId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

//   const handleLike = async () => {
//     try {
//       const newLikes = isLiked ? likes - 1 : likes + 1;
//       await databases.updateDocument(
//         DATABASES.MAIN,
//         COLLECTIONS.ARTWORKS,
//         artworkId,
//         { likes: newLikes }
//       );
//       setLikes(newLikes);
//       setIsLiked(!isLiked);
//     } catch (error) {
//       console.error("Error updating likes:", error);
//     }
//   };

  return (
    <TouchableOpacity onPress={handleLike} className="flex-row items-center">
      <MaterialCommunityIcons
        name={isLiked ? "heart" : "heart-outline"}
        size={24}
        color={isLiked ? "#F2994A" : "#4A90E2"}
      />
      <Text className="ml-2 text-gray-600">{likes}</Text>
    </TouchableOpacity>
  );
}
