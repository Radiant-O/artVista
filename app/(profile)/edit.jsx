import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, storage, db, COLLECTIONS } from "../../lib/firebase";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace("/(auth)/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileDoc = await getDoc(
          doc(db, COLLECTIONS.PROFILES, auth.currentUser.uid)
        );
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          setName(data.name);
          setBio(data.bio || "");
          setAvatarUrl(data.avatarUrl || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error loading profile data");
      }
    };

    fetchProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        await uploadBytes(imageRef, blob);
        const url = await getDownloadURL(imageRef);
        setAvatarUrl(url);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setLoading(true);
      await updateDoc(doc(db, COLLECTIONS.PROFILES, auth.currentUser.uid), {
        name,
        bio,
        avatarUrl,
        updatedAt: new Date().toISOString(),
      });
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error saving profile changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      <TouchableOpacity onPress={pickImage} className="items-center mb-6">
        <View className="relative">
          <Image
            source={{ uri: avatarUrl || "https://via.placeholder.com/100" }}
            className="w-24 h-24 rounded-full"
          />
          <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full">
            <MaterialCommunityIcons name="camera" size={20} color="white" />
          </View>
        </View>
      </TouchableOpacity>

      <View className="bg-white p-4 rounded-lg">
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          className="border-b border-gray-200 p-2 mb-4"
        />

        <TextInput
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          className="border-b border-gray-200 p-2 mb-4"
        />

        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className={`bg-primary p-4 rounded-lg ${loading ? "opacity-50" : ""}`}
        >
          <Text className="text-white text-center font-bold">
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
