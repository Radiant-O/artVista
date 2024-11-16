import { TouchableOpacity, Text } from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db, COLLECTIONS } from "../lib/firebase";

export default function LikeButton({ artworkId }) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!artworkId || !auth.currentUser) return;

    const fetchLikeStatus = async () => {
      const likeDoc = doc(db, "likes", `${auth.currentUser.uid}_${artworkId}`);
      const docSnap = await getDoc(likeDoc);
      setIsLiked(docSnap.exists());
    };

    const fetchLikes = async () => {
      const artworkDoc = doc(db, COLLECTIONS.ARTWORKS, artworkId);
      const docSnap = await getDoc(artworkDoc);
      if (docSnap.exists()) {
        setLikes(docSnap.data().likes || 0);
      }
    };

    fetchLikeStatus();
    fetchLikes();
  }, [artworkId]);

  const handleLike = async () => {
    if (!auth.currentUser) {
      alert("Please login to like artworks");
      return;
    }

    try {
      const artworkRef = doc(db, COLLECTIONS.ARTWORKS, artworkId);
      const likeRef = doc(db, "likes", `${auth.currentUser.uid}_${artworkId}`);

      if (isLiked) {
        await deleteDoc(likeRef);
        await updateDoc(artworkRef, {
          likes: increment(-1),
        });
        setLikes((prev) => prev - 1);
      } else {
        await setDoc(likeRef, {
          userId: auth.currentUser.uid,
          artworkId,
          createdAt: new Date().toISOString(),
        });
        await updateDoc(artworkRef, {
          likes: increment(1),
        });
        setLikes((prev) => prev + 1);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating likes:", error.message);
      alert(error.message);
    }
  };

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
