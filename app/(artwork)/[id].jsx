import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, COLLECTIONS } from "../../lib/firebase";
import LikeButton from "../../components/LikeButton";
import Comment from "../../components/Comment";
import AddComment from "../../components/AddComment";

export default function ArtworkDetail() {
  const { id } = useLocalSearchParams();
  const [artwork, setArtwork] = useState(null);
  const [artist, setArtist] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchArtworkAndArtist = async () => {
      try {
        const artworkDoc = await getDoc(doc(db, COLLECTIONS.ARTWORKS, id));
        if (artworkDoc.exists()) {
          const artworkData = { id: artworkDoc.id, ...artworkDoc.data() };
          setArtwork(artworkData);

          // Fetch artist details
          const artistDoc = await getDoc(
            doc(db, COLLECTIONS.PROFILES, artworkData.artistId)
          );
          if (artistDoc.exists()) {
            setArtist({ id: artistDoc.id, ...artistDoc.data() });
          }
        }
      } catch (error) {
        console.error("Error fetching artwork:", error);
        alert("Error loading artwork details");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkAndArtist();

    // Set up comments listener
    const commentsQuery = query(
      collection(db, COLLECTIONS.COMMENTS),
      where("artworkId", "==", id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsList);
    });

    return () => unsubscribe();
  }, [id]);

  const handleShare = async () => {
    try {
      alert("Share functionality coming soon!");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!artwork) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-lg text-gray-600">Artwork not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary px-6 py-2 rounded-lg"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Image
        source={{ uri: artwork.imageUrl }}
        className="w-full h-72"
        resizeMode="cover"
      />

      <View className="p-4 bg-white">
        <Text className="text-2xl font-bold text-gray-800">
          {artwork.title}
        </Text>
        <TouchableOpacity
          onPress={() => router.push(`/profile/${artwork.artistId}`)}
          className="mt-1"
        >
          <Text className="text-primary">
            by {artist?.name || "Unknown Artist"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-between mt-4">
          <LikeButton artworkId={id} />
          <TouchableOpacity
            onPress={handleShare}
            className="flex-row items-center"
          >
            <MaterialCommunityIcons name="share" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <Text className="mt-4 text-gray-700">{artwork.description}</Text>

        <View className="flex-row flex-wrap mt-4">
          {artwork.tags?.map((tag, index) => (
            <View
              key={index}
              className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
            >
              <Text className="text-gray-600">#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="bg-white mt-2 p-4">
        <Text className="text-xl font-bold mb-4">Comments</Text>
        <AddComment artworkId={id} />
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </View>
    </ScrollView>
  );
}
