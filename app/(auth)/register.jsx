import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {doc, setDoc } from "firebase/firestore"
import { auth, db, COLLECTIONS } from "../../lib/firebase";
import AuthInput from "../../components/AuthInput";
import AuthButton from "../../components/AuthButton";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      setLoading(true);
        const user = await createUserWithEmailAndPassword(auth, email, password)
        console.log(user)
        
        await setDoc(doc(db, COLLECTIONS.PROFILES, user.user.uid), {
            userId: user.user.uid,
            name,
            bio: "",
            avatarUrl: "",
            
        });

      router.replace("/");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4 justify-center">
      <View className="bg-white p-6 rounded-2xl shadow-sm">
        <Text className="text-2xl font-bold text-center mb-6 text-primary">
          Create Account
        </Text>

        <AuthInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

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

        <AuthButton
          title="Register"
          onPress={handleRegister}
          loading={loading}
        />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="mt-4"
        >
          <Text className="text-center text-primary">
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
