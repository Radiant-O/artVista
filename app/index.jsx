import { View, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ArtworkCard from "../components/ArtworkCard";
// import { databases, DATABASES, COLLECTIONS } from "../lib/appwrite";

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      // Implement Appwrite fetch logic here when database is set up
      // For now, using dummy data
      setArtworks([
        {
          id: "1",
          title: "Abstract Harmony",
          image: "https://placeholder.com/300",
          artist: "Jane Doe",
          likes: 120,
        },
        // Add more dummy artworks
      ]);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  const renderItem = ({ item }) => (
    <ArtworkCard
      artwork={item}
      onPress={() => router.push(`/artwork/${item.id}`)}
      isGridView={isGridView}
    />
  );

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="p-2"
        >
          <MaterialCommunityIcons name="account" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsGridView(!isGridView)}
          className="p-2"
        >
          <MaterialCommunityIcons
            name={isGridView ? "view-list" : "view-grid"}
            size={24}
            color="#4A90E2"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={artworks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? "grid" : "list"}
        className="px-2"
      />

      <TouchableOpacity
        onPress={() => router.push("/profile/upload")}
        className="absolute bottom-6 right-6 bg-primary p-4 rounded-full shadow-lg"
      >
        <MaterialCommunityIcons name="plus" size={24} color="blue" />
      </TouchableOpacity>
    </View>
  );
}
