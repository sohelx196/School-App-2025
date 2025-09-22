import { Stack } from "expo-router";
import tabLayout from "./(tabs)/_layout";

export default function RootLayout() {
     return ( 
        <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown:false}} />
        </Stack>
     );
}
