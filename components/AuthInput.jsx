import { TextInput } from "react-native";

export default function AuthInput({ ...props }) {
  return (
    <TextInput
      {...props}
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
      placeholderTextColor="#666"
    />
  );
}
