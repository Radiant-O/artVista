import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
// import { databases, DATABASES, COLLECTIONS } from "../lib/appwrite";
// import { ID } from "appwrite";

export default function CommentList({ artworkId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchComments();
//   }, [artworkId]);

//   const fetchComments = async () => {
//     try {
//       const response = await databases.listDocuments(
//         DATABASES.MAIN,
//         COLLECTIONS.COMMENTS,
//         [databases.equal("artworkId", artworkId)]
//       );
//       setComments(response.documents);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     }
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;

//     try {
//       setLoading(true);
//       await databases.createDocument(
//         DATABASES.MAIN,
//         COLLECTIONS.COMMENTS,
//         ID.unique(),
//         {
//           artworkId,
//           content: newComment,
//           createdAt: new Date().toISOString(),
//         }
//       );
//       setNewComment("");
//       fetchComments();
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

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
          disabled={loading}
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
