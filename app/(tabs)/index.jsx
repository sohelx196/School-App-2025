import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <>
    


    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
     

      <View style={{ borderWidth:2,padding:4,borderRadius:5,borderColor:"gray",boxShadow:"0px 0px 2px gray" }}>
        <Link href="/AddStudents"> <Text>Add Student +</Text> </Link>
      </View>


    </View>
 </>
  );
}
