import { Tabs } from "expo-router"

export default function tabLayout(){

 return(
    <Tabs>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="Attendence" />
      <Tabs.Screen name="Tests" />
    </Tabs>
 )
}