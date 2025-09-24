import { Tabs } from "expo-router"
import {View ,Text ,  Image } from "react-native"


export default function tabLayout(){

 return(
    <Tabs 
    screenOptions={{
  headerStyle: {
      backgroundColor: '#dcedf9ff',
    },
      tabBarActiveTintColor: 'black',  // TAB BAR KE TEXT KA COLOR
      headerTintColor: '#1b0101ff', // HEADER KE TEXT KA COLOR
      
       tabBarStyle: {
          borderTopWidth: 1,
          borderRadius:50,
          backgroundColor:"#dcedf9ff",
        },


      tabBarShowIcon: false,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },

  


    }}
    >
      <Tabs.Screen name="index"  options={{title:"Home"}} />


      <Tabs.Screen name="Attendence" options={{title:"Attendence" ,
         tabBarIcon: ({ focused, color, size }) => (
                        <Image
                          source={focused ? require('../../assets/MainImg/attendance.png') : require('../../assets/MainImg/attendance.png')}
                          style={{ width: size, height: size, tintColor: "" }} 
                        />
                      )
      }} />
      <Tabs.Screen name="Tests"  options={{title:"Tests"}}/>
      <Tabs.Screen name="Notes"  options={{title:"Notes"}}/>
    </Tabs>
 )
}