import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4A90E2",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "ArtVista",
          }}
        />
        {/* <Stack.Screen
          name="artwork/[id]"
          options={{
            title: "Artwork Details",
          }}
        /> */}
        <Stack.Screen
          name="(auth)/login"
          options={{
            title: "Login",
          }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{
            title: "Register",
          }}
        />
        {/* <Stack.Screen
          name="profile/upload"
          options={{
            title: "Upload Artwork",
          }}
        />
        <Stack.Screen
          name="profile/index"
          options={{
            title: "My Profile",
          }} 
        />*/}
      </Stack>
    </GestureHandlerRootView>
  );
}
