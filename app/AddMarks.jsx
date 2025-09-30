// TestScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../services/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,   
  serverTimestamp,
} from "firebase/firestore";



export default function TestScreen() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({}); // { studentId: marks }

  const [testName, setTestName] = useState("");
  const [subject, setSubject] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const sections = ["A", "B", "C", "D"];

  // Fetch students...
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass && selectedSection) {
        try {
          const q = query(
            collection(db, "students"),
            where("className", "==", selectedClass),
            where("section", "==", selectedSection)
          );
          const snapshot = await getDocs(q);
          const data = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setStudents(data);
          // Reset marks
          const initialMarks = {};
          data.forEach((s) => (initialMarks[s.id] = ""));
          setMarks(initialMarks);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      } else {
        setStudents([]);
        setMarks({});
      }
    };

    fetchStudents();
  }, [selectedClass, selectedSection]);

  // Handle marks input
  const handleMarkChange = (id, value) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    setMarks((prev) => ({ ...prev, [id]: numericValue }));
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const saveTest = async () => {
    if (!selectedClass || !selectedSection || !testName || !subject || !totalMarks) {
      Alert.alert("⚠️", "Please fill all test details!");
      return;
    }

    if (students.length === 0) {
      Alert.alert("⚠️", "No students found for this class/section.");
      return;
    }

    try {
      const testRecord = {
        className: selectedClass,
        section: selectedSection,
        testName,
        subject,
        totalMarks: parseInt(totalMarks),
        date: date.toDateString(),
        students: students.map((stu) => ({
          id: stu.id,
          name: stu.name,
          marks: marks[stu.id] ? parseInt(marks[stu.id]) : 0,
        })),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "tests"), testRecord);
      Alert.alert("✅", "Test marks saved successfully!");
      // Reset marks input
      const resetMarks = {};
      students.forEach((s) => (resetMarks[s.id] = ""));
      setMarks(resetMarks);
      setTestName("");
      setSubject("");
      setTotalMarks("");
    } catch (error) {
      console.error("Error saving test:", error);
      Alert.alert("❌", "Failed to save test marks.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Class & Section */}
      <View style={styles.row}> 
        <View style={styles.pickerWrap}>
          <Text style={styles.label}>Class</Text>
          <Picker selectedValue={selectedClass} onValueChange={setSelectedClass}>
            <Picker.Item label="Select class" value="" />
            {classes.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrap}>
          <Text style={styles.label}>Section</Text>
          <Picker selectedValue={selectedSection} onValueChange={setSelectedSection}>
            <Picker.Item label="Select section" value="" />
            {sections.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Test Details */}
      <TextInput
        style={styles.input}
        placeholder="Test Name"
        value={testName}
        onChangeText={setTestName}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={styles.input}
        placeholder="Total Marks"
        keyboardType="numeric"
        value={totalMarks}
        onChangeText={setTotalMarks}
      />

      {/* Date */}
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
        />
      )}

      {/* Students List */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentRow}>
            <Text style={styles.studentText}>{item.name}</Text>
            <TextInput
              style={styles.markInput}
              placeholder="Marks"
              keyboardType="numeric"
              value={marks[item.id]}
              onChangeText={(val) => handleMarkChange(item.id, val)}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>
            {selectedClass && selectedSection
              ? "No students found in this class & section.😕"
              : "Please select Class and Section."}
          </Text>
        }
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveTest}>
        <Text style={styles.saveButtonText}>Save Test Marks</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  pickerWrap: {
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  label: { fontSize: 14, paddingLeft: 8, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    backgroundColor: "#f6fbff",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  dateText: { fontWeight: "bold" },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  studentText: { fontSize: 16 },
  markInput: {
    width: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    textAlign: "center",
  },
  saveButton: {
   marginTop: 20,
    backgroundColor: "#f6f6f6ff",
    borderWidth:1,
    borderColor:"black",
    
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    boxShadow:"3px 3px 1px black",
  },
  saveButtonText: {   color: "black",
    fontSize: 18,
    fontWeight: "bold", },
});


