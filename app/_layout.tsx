import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter'
import "./global.css"

export default function RootLayout() {

  const [loaded, error] = useFonts({
    interMedium: Inter_500Medium,
  })

  if (!loaded && !error) {
    return null
  }
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="todos/[id]" />
      </Stack>
    </SafeAreaProvider>
  )
}
