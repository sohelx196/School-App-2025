import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

import { Link } from "expo-router";

export default function MarksShowScreen({ navigation }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8","9","10","11","12"];
  const sections = ["A", "B", "C", "D"];

  // Fetch tests when class/section changes
  useEffect(() => {
    const fetchTests = async () => {
      if (selectedClass && selectedSection) {
        const q = query(
          collection(db, "tests"),
          where("className", "==", selectedClass),
          where("section", "==", selectedSection)
        );
        const snapshot = await getDocs(q);

        const data = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setTests(data);
      } else {
        setTests([]);
        setStudents([]);
      }
    };

    fetchTests();
  }, [selectedClass, selectedSection]);

  // Update students list when test changes
  useEffect(() => {
    if (selectedTest) {
      const test = tests.find((t) => t.id === selectedTest);
      setStudents(test ? test.students : []);
    } else {
      setStudents([]);
    }
  }, [selectedTest, tests]);

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.row}>
        <View style={styles.pickerWrap}>
          {/* <Text>Class</Text> */}
          <Picker selectedValue={selectedClass} onValueChange={setSelectedClass}>
            <Picker.Item label="Class" value="" />
            {classes.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrap}>
          {/* <Text>Section</Text> */}
          <Picker
            selectedValue={selectedSection}
            onValueChange={setSelectedSection}
          >
            <Picker.Item label="Section" value="" />
            {sections.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Test Selector */}
      {tests.length > 0 && (
        <View style={styles.picker}>
          {/* <Text>Select Test</Text> */}
          <Picker selectedValue={selectedTest} onValueChange={setSelectedTest}>
            <Picker.Item label="Select Test" value="" />
            {tests.map((t) => (
              <Picker.Item
                key={t.id}
                label={`${t.testName} (${t.date})`}
                value={t.id}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* Students & Marks */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentRow}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.marks}>{item.marks}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
            {selectedClass && selectedSection
              ? "No marks found for this class & section."
              : "Please select Class and Section."}
          </Text>
        }
      />

      {/* Add Marks Button */}
      {/* <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddStudents")}
      >
        <Text style={styles.addText}>+ Add Marks</Text>
      </TouchableOpacity> */}



        <Link href="/AddMarks">
               <View style={styles.markBtn}>
                 <Text style={styles.btnText}>Add More Test</Text>
               </View>
        </Link>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flexDirection: "row", justifyContent: "space-between" },

 picker: {
     

    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding:7,
    margin:6
},

  pickerWrap: {
    flex: 1,
    margin: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius:8,
    padding:1,

     marginHorizontal: 6,
  },

  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  studentName: { fontSize: 16 },
  marks: { fontSize: 16, fontWeight: "bold" },
  addButton: {
    marginTop: 20,
    backgroundColor: "black",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addText: { color: "white", fontSize: 18, fontWeight: "bold" },

  markBtn: {
    backgroundColor: "#f6f6f6ff",
    borderWidth:1,
    borderColor:"black",
    padding: 6,
    borderRadius: 8,
    boxShadow:"3px 3px 1px black",
  
  }


});
