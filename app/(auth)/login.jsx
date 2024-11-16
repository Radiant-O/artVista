import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import AuthInput from "../../components/AuthInput";
import AuthButton from "../../components/AuthButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password)
      router.replace("/");
    } catch (error) {
        console.error("Login error:", error);
        alert(error.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4 justify-center">
      <View className="bg-white p-6 rounded-2xl shadow-sm">
        <Text className="text-2xl font-bold text-center mb-6 text-primary">
          Welcome Back
        </Text>

        <AuthInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AuthInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AuthButton title="Login" onPress={handleLogin} loading={loading} />

        <TouchableOpacity
          onPress={() => router.push("(auth)/register")}
          className="mt-4"
        >
          <Text className="text-center text-primary">
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
