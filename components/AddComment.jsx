import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db, COLLECTIONS } from "../lib/firebase";

export default function AddComment({ artworkId }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim() || !auth.currentUser) return;

    try {
      setLoading(true);
      await addDoc(collection(db, COLLECTIONS.COMMENTS), {
        artworkId,
        userId: auth.currentUser.uid,
        content: comment.trim(),
        createdAt: new Date().toISOString(),
      });
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-row mb-4">
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Add a comment..."
        className="flex-1 bg-gray-50 p-3 rounded-lg mr-2"
      />
      <TouchableOpacity
        onPress={handleAddComment}
        disabled={loading || !auth.currentUser}
        className={`bg-primary px-4 rounded-lg justify-center ${
          loading || !auth.currentUser ? "opacity-50" : ""
        }`}
      >
        <Text className="text-white">Post</Text>
      </TouchableOpacity>
    </View>
  );
}
