import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

export default function AuthButton({ title, onPress, loading }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`bg-primary p-4 rounded-lg ${loading ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-center font-bold">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
