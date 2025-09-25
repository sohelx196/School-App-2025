import { db } from "../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


import { Picker } from "@react-native-picker/picker";
import { TextInput,  View,  StyleSheet,  TouchableOpacity,  Text,} from "react-native";
import { useState } from "react";



export default function AddStudents() {
  // student name state
  const [studentName, setStudentName] = useState("");
  // students class andd section state
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // for button disableling while submitting
  const [loading, setLoading] = useState(false);



  // classes & section arrayy
  const classes = ["1", "2", "3", "4"];
  const sections = ["A", "B", "C", "D"];



    const handleAddStudent = async () => {
      // checking here for null inputs validation
    if (!studentName || !selectedClass || !selectedSection) {
      alert("Fill all fields first!");
      return;
    }

     setLoading(true); //saving is started..


        try {
          // students collection added
      await addDoc(collection(db, "students"), {
        name: studentName,
        className: selectedClass,
        section: selectedSection,
        createdAt: serverTimestamp(), // stored creation time
      });

        alert(`${studentName} added successfully!`);

         setStudentName("");        // 
         setSelectedClass("");      // blancked after submited
         setSelectedSection("");    // 
    }
      catch (error){
              console.error("Error adding student: ", error);
              alert("Error adding student, check console");  
      }   

      setLoading(false); //show that saving is endedd..

    };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        style={styles.inputs}
        placeholder="Student Name"
        value={studentName}
        onChangeText={setStudentName}
      />

      {/* classs pick */}
      <Picker
        selectedValue={selectedClass}
        style={styles.inputs}
        onValueChange={(itemValue) => setSelectedClass(itemValue)}
      >
        <Picker.Item label="Select Class" value="" />
        {classes.map((cls) => (
          <Picker.Item key={cls} label={`Class ${cls}`} value={cls} />
        ))}
      </Picker>


      {/* section pick */}
      <Picker
        selectedValue={selectedSection}
        // style={[styles.inputs, { textAlign: "center"}]}  this is for aligning text to the center
        style={styles.inputs}
        onValueChange={(itemValue) => setSelectedSection(itemValue)}
      >
        <Picker.Item label="Select Section" value="" />
        {sections.map((sec) => (
          <Picker.Item key={sec} label={`Section ${sec}`} value={sec} />
        ))}
      </Picker>


      {/* <Button title="Add Student6" style={styles.btn} />  we did not use it because of limited stylingg */}

      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.5 }]} onPress={handleAddStudent} disabled={loading}>
        <Text>{loading ? "Adding..." : "Add Student"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputs: {
    borderWidth: 1,
    width: "70%",
    textAlign: "center",
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#c1d7eeff",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: "black",
    marginTop: 10,
  },
});
