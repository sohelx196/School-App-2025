import { Tabs } from "expo-router"

export default function tabLayout(){

 return(
    <Tabs 
    screenOptions={{
  headerStyle: {
      backgroundColor: '#dcedf9ff',
    },
      tabBarActiveTintColor: '#ffd33d',  // TAB BAR KE TEXT KA COLOR
      headerTintColor: '#1b0101ff', // HEADER KE TEXT KA COLOR
      tabBarStyle: {
      backgroundColor: '#1b1f22ff',
      },
    }}
    >
      <Tabs.Screen name="index"  options={{title:"Home"}}/>
      <Tabs.Screen name="Attendence" options={{title:"Attendence"}}/>
      <Tabs.Screen name="Tests"  options={{title:"Test"}}/>
      <Tabs.Screen name="Notes"  options={{title:"Notes"}}/>
    </Tabs>
 )
}