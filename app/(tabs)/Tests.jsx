import { View } from "react-native";
import { Text } from "react-native";

export default function Tests(){

    return(
        <View style={{
           flex:1,
           justifyContent:"center", 
           alignItems:"center"
        }}>

            <Text style={{fontSize:20}}>Test Screen</Text>
        </View>
    )
}