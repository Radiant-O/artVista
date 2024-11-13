import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { databases, DATABASES, COLLECTIONS } from "../../lib/appwrite";
import CommentList from "../../components/CommentList";
import LikeButton from "../../components/LikeButton";

export default function ArtworkDetail() {
  const { id } = useLocalSearchParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtwork();
  }, [id]);

  const fetchArtwork = async () => {
    try {
      const response = await databases.getDocument(
        DATABASES.MAIN,
        COLLECTIONS.ARTWORKS,
        id
      );
      setArtwork(response);
    } catch (error) {
      console.error("Error fetching artwork:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Image
        source={{ uri: artwork?.image }}
        className="w-full h-72"
        resizeMode="cover"
      />

      <View className="p-4 bg-white">
        <Text className="text-2xl font-bold text-gray-800">
          {artwork?.title}
        </Text>
        <Text className="text-gray-600 mt-1">by {artwork?.artist}</Text>

        <View className="flex-row items-center justify-between mt-4">
          <LikeButton artworkId={id} initialLikes={artwork?.likes} />
          <TouchableOpacity className="flex-row items-center">
            <MaterialCommunityIcons name="share" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <Text className="mt-4 text-gray-700">{artwork?.description}</Text>

        <View className="flex-row flex-wrap mt-4">
          {artwork?.tags?.map((tag, index) => (
            <View
              key={index}
              className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
            >
              <Text className="text-gray-600">#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <CommentList artworkId={id} />
    </ScrollView>
  );
}
