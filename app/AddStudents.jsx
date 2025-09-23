

import { TextInput, View , Button , StyleSheet, TouchableOpacity , Text} from "react-native";


export default function AddStudents(){
    return(
       
        <View
          style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>


           <TextInput
             style={styles.inputs}
             placeholder="Student Name"
           />
           <TextInput
             style={styles.inputs}
             placeholder="Student Class"
           />
           <TextInput
             style={styles.inputs}
             placeholder="Student Section"
           />

   {/* <Button title="Add Student" style={styles.btn} />  we did not use it because of limited stylingg */}

<TouchableOpacity style={styles.btn} >
  <Text>Add Student</Text>
</TouchableOpacity>


        </View>

    )
}


const styles = StyleSheet.create({
  inputs : {
    borderWidth: 1,
    width:"50%",
    textAlign:"center",
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff"
  },
  btn:{
     backgroundColor: "#c1d7eeff",
       
     padding: 12,
     borderRadius: 8,
     borderColor:"black",
     marginTop:10
  }
})