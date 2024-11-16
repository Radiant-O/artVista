import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db, COLLECTIONS } from "../lib/firebase";

export default function CommentList({ artworkId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!artworkId) return;

    const q = query(
      collection(db, COLLECTIONS.COMMENTS),
      where("artworkId", "==", artworkId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsList);
    });

    return () => unsubscribe();
  }, [artworkId]);

    const handleAddComment = async () => {
      if (!newComment.trim() || !auth.currentUser) return;

      try {
        setLoading(true);
        await addDoc(collection(db, COLLECTIONS.COMMENTS), {
          artworkId,
          userId: auth.currentUser.uid,
          content: newComment,
          createdAt: new Date().toISOString(),
        });
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error.message);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };


  return (
    <View className="bg-white p-4 mt-2">
      <Text className="text-xl font-bold mb-4">Comments</Text>

      <View className="flex-row mb-4">
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          className="flex-1 bg-gray-50 p-3 rounded-lg mr-2"
        />
        <TouchableOpacity
          onPress={handleAddComment}
          disabled={loading || !auth.currentUser}
          className={`bg-primary px-4 rounded-lg justify-center ${
            loading ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white">Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View className="bg-gray-50 p-3 rounded-lg mb-2">
            <Text className="text-gray-800">{item.content}</Text>
            <Text className="text-gray-500 text-sm mt-1">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
