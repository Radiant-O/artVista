import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "../lib/firebase";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function ArtworkCard({ artwork, onPress, isGridView }) {
  const [artistName, setArtistName] = useState("");

  useEffect(() => {
    const fetchArtistName = async () => {
      try {
        const artistDoc = await getDoc(
          doc(db, COLLECTIONS.PROFILES, artwork.artistId)
        );
        if (artistDoc.exists()) {
          setArtistName(artistDoc.data().name);
        }
      } catch (error) {
        console.error("Error fetching artist name:", error);
      }
    };

    if (artwork.artistId) {
      fetchArtistName();
    }
  }, [artwork.artistId]);

  const cardStyle = isGridView ? "w-[48%] m-1" : "w-full mb-4";

  return (
    <Animated.View
      entering={FadeInUp}
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${cardStyle}`}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image
          source={{ uri: artwork.imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="p-3">
          <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
            {artwork.title}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={1}>
            {artistName || "Loading..."}
          </Text>
          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons name="heart" size={16} color="#F2994A" />
            <Text className="ml-1 text-gray-600">{artwork.likes || 0}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
