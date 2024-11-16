import { View, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ArtworkCard from "../components/ArtworkCard";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db, COLLECTIONS } from "../lib/firebase";

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 useEffect(() => {
   const q = query(
     collection(db, COLLECTIONS.ARTWORKS),
     orderBy("createdAt", "desc")
   );

   const unsubscribe = onSnapshot(q, (snapshot) => {
     const artworksList = snapshot.docs.map((doc) => ({
       id: doc.id,
       ...doc.data(),
     }));
     console.log(artworksList)
     setArtworks(artworksList);
     setLoading(false);
   });

   return () => unsubscribe();
 }, []);
  
  const renderItem = ({ item }) => (
    <ArtworkCard
      artwork={item}
      onPress={() => router.push(`/(artwork)/${item.id}`)}
      isGridView={isGridView}
    />
  );

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity
          onPress={() =>
            router.push(auth.currentUser ? "./(profile)" : "/(auth)/login")
          }
          className="p-2"
        >
          <MaterialCommunityIcons
            name="account"
            size={24}
            color={auth.currentUser ? "#4A90E2" : "#662"}
          />
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
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {auth.currentUser && (
        <TouchableOpacity
          onPress={() => router.push("/(profile)/upload")}
          className="absolute bottom-6 right-6 bg-primary p-4 rounded-full shadow-lg"
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
