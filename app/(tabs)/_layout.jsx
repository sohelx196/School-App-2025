import { Tabs } from "expo-router"

export default function tabLayout(){

 return(
    <Tabs>
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Attendence" />
    </Tabs>
 )
}