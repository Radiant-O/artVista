import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { account, databases, DATABASES, COLLECTIONS } from "../../lib/appwrite";
import ArtworkCard from "../../components/ArtworkCard";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [userArtworks, setUserArtworks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
    fetchUserArtworks();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = await account.get();
      const profileData = await databases.listDocuments(
        DATABASES.MAIN,
        COLLECTIONS.PROFILES,
        [databases.equal("userId", user.$id)]
      );
      setProfile(profileData.documents[0]);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchUserArtworks = async () => {
    try {
      const user = await account.get();
      const artworks = await databases.listDocuments(
        DATABASES.MAIN,
        COLLECTIONS.ARTWORKS,
        [databases.equal("artistId", user.$id)]
      );
      setUserArtworks(artworks.documents);
    } catch (error) {
      console.error("Error fetching user artworks:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="bg-white p-6">
        <View className="items-center">
          <Image
            source={{
              uri: profile?.avatarId
                ? `YOUR_APPWRITE_ENDPOINT/storage/files/${profile.avatarId}`
                : "https://via.placeholder.com/100",
            }}
            className="w-24 h-24 rounded-full"
          />
          <Text className="text-xl font-bold mt-4">{profile?.name}</Text>
          <Text className="text-gray-600 mt-2">
            {profile?.bio || "No bio yet"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="mt-6 flex-row items-center justify-center"
        >
          <MaterialCommunityIcons name="logout" size={20} color="#F2994A" />
          <Text className="ml-2 text-secondary">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <Text className="text-xl font-bold mb-4">My Artworks</Text>
        <View className="flex-row flex-wrap justify-between">
          {userArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.$id}
              artwork={artwork}
              onPress={() => router.push(`/artwork/${artwork.$id}`)}
              isGridView={true}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
