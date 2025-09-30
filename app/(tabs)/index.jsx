import { Link } from "expo-router";
import { Text, View, Image, StyleSheet } from "react-native";

export default function Index() {
  return (
    <>
      <View style={styles.container}>


    {/* <Text style={styles.heading}>Saraswati Shishu/Vidya Mandir</Text>
    <Text style={styles.heading}> Anand Nagar, Khandwa</Text> */}
    <Text style={styles.heading}>सरस्वती शिशु / विद्या मंदिर,</Text>
    <Text style={styles.heading}>आनंद नगर,खंडवा</Text>


        <Image 
          source={require("../../assets/MainImg/students.png")}
          style={styles.logo}
          resizeMode="contain"  
        />

          <Link href="/AddStudents">
        <View style={styles.buttonContainer}>
            <Text style={styles.btn}>Add Students +</Text>
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
    borderRadius: 10,
    borderColor: "gray",
    backgroundColor: "white",
    boxShadow:"2px 2px 1px black",
  },

  btn:{
   fontSize:17,
  },

  heading:{
    fontSize:20,
    fontWeight:500,
    color:"darkred"
  }
});
