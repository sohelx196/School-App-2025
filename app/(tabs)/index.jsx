import { Link } from "expo-router";
import { Text, View, Image, StyleSheet } from "react-native";

export default function Index() {
  return (
    <>
      <View style={styles.container}>
    
        <Image 
          source={require("../../assets/MainImg/students.png")}
          style={styles.logo}
          resizeMode="contain"  
        />

          <Link href="/AddStudents">
        <View style={styles.buttonContainer}>
            <Text>Add Student +</Text>
        </View>
          </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",   
    alignItems: "center",          
    paddingTop: 20,        
  },
  logo: {
    width: 170,                    
    height: 170,               
    marginBottom: 20,            
  },
  buttonContainer: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    borderColor: "gray",
    backgroundColor: "white",
  },
});
