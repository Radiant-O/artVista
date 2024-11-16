import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db, COLLECTIONS } from "../../lib/firebase";
import ArtworkCard from "../../components/ArtworkCard";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [userArtworks, setUserArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace("/(auth)/login");
      return;
    }

    const fetchProfileAndArtworks = async () => {
      try {
        // Fetch user profile
        const profileDoc = await getDoc(
          doc(db, COLLECTIONS.PROFILES, auth.currentUser.uid)
        );
        if (profileDoc.exists()) {
          setProfile({ id: profileDoc.id, ...profileDoc.data() });
        }

        // Fetch user artworks
        const artworksQuery = query(
          collection(db, COLLECTIONS.ARTWORKS),
          where("artistId", "==", auth.currentUser.uid)
        );
        const artworksSnapshot = await getDocs(artworksQuery);
        const artworksList = artworksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserArtworks(artworksList);
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error loading profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndArtworks();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="bg-white p-6">
        <View className="items-center">
          <Image
            source={{
              uri: profile?.avatarUrl || "https://via.placeholder.com/100",
            }}
            className="w-24 h-24 rounded-full"
          />
          <Text className="text-xl font-bold mt-4">{profile?.name}</Text>
          <Text className="text-gray-600 mt-2">
            {profile?.bio || "No bio yet"}
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(profile)/edit")}
            className="mt-4 bg-gray-100 px-4 py-2 rounded-lg"
          >
            <Text className="text-primary">Edit Profile</Text>
          </TouchableOpacity>
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
              key={artwork.id}
              artwork={artwork}
              onPress={() => router.push(`/(artwork)/${artwork.id}`)}
              isGridView={true}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
