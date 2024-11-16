import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "../lib/firebase";

export default function Comment({ comment }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userDoc = await getDoc(
          doc(db, COLLECTIONS.PROFILES, comment.userId)
        );
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, [comment.userId]);

  return (
    <View className="bg-gray-50 p-3 rounded-lg mb-2">
      <Text className="font-bold text-gray-800">{userName || "Anonymous"}</Text>
      <Text className="text-gray-800">{comment.content}</Text>
      <Text className="text-gray-500 text-sm mt-1">
        {new Date(comment.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );
}
