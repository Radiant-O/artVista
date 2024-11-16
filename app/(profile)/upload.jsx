import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { auth, storage, db, COLLECTIONS } from "../../lib/firebase";

export default function UploadArtwork() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(image);
      const blob = await response.blob();
      const imageRef = ref(storage, `artworks/${Date.now()}`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);
      await addDoc(collection(db, COLLECTIONS.ARTWORKS), {
        title,
        description,
        imageUrl,
        artistId: auth.currentUser.uid,
        tags: tags.split(",").map((tag) => tag.trim()),
        likes: 0,
        createdAt: new Date().toISOString(),
      });

      router.back();
    } catch (error) {
      console.error("Upload error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      <TouchableOpacity
        onPress={pickImage}
        className="h-48 bg-white rounded-lg justify-center items-center mb-4"
      >
        {image ? (
          <Image source={{ uri: image }} className="w-full h-full rounded-lg" />
        ) : (
          <MaterialCommunityIcons name="image-plus" size={48} color="#4A90E2" />
        )}
      </TouchableOpacity>

      <View className="bg-white p-4 rounded-lg">
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          className="border-b border-gray-200 p-2 mb-4"
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          className="border-b border-gray-200 p-2 mb-4"
        />

        <TextInput
          placeholder="Tags (comma-separated)"
          value={tags}
          onChangeText={setTags}
          className="border-b border-gray-200 p-2 mb-4"
        />

        <TouchableOpacity
          onPress={handleUpload}
          disabled={loading || !image}
          className={`bg-primary p-4 rounded-lg ${
            !image || loading ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white text-center font-bold">
            {loading ? "Uploading..." : "Upload Artwork"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
