import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function ArtworkCard({ artwork, onPress, isGridView }) {
  const cardStyle = isGridView ? "w-[48%] m-1" : "w-full mb-4";

  return (
    <Animated.View
      entering={FadeInUp}
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${cardStyle}`}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image
          source={{ uri: artwork.image }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="p-3">
          <Text className="text-lg font-bold text-gray-800">
            {artwork.title}
          </Text>
          <Text className="text-sm text-gray-600">by {artwork.artist}</Text>
          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons name="heart" size={16} color="#F2994A" />
            <Text className="ml-1 text-gray-600">{artwork.likes}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
