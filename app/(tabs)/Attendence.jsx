// AttendanceScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";

export default function AttendanceScreen() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // dummy data for testing
  const classes = ["6", "7", "8"];
  const sections = ["A", "B", "C"];
  const students = [
    { id: "1", name: "Rahul Kumar" },
    { id: "2", name: "Sneha Singh" },
    { id: "3", name: "Amit Sharma" },
  ];

  const [attendance, setAttendance] = useState({});

  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === "present" ? "absent" : "present",
    }));
  };

  return (
    <View style={styles.container}>


      {/* <Text style={styles.title}>Mark Attendance</Text> */}

      {/* Dropdowns */}
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

      <Text style={styles.title}>Select Data of Attendence :</Text>
      {/* Calendar */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#e90b0bff" },
        }}
        style={{ marginBottom: 16 }}
      />

      {/* Students List */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const status = attendance[item.id] || "absent";
          return (
            <View style={styles.studentRow}>
              <Text style={styles.studentText}>{item.name}</Text>
              <TouchableOpacity
                style={[
                  styles.chip,
                  status === "present" ? styles.present : styles.absent,
                ]}
                onPress={() => toggleAttendance(item.id)}
              >
                <Text style={styles.chipText}>
                  {status === "present" ? "Present" : "Absent"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 , marginTop:10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  pickerWrap: { flex: 1, marginHorizontal: 6, borderWidth: 1, borderColor: "#ddd", borderRadius: 8 },
  label: { fontSize: 14, paddingLeft: 8, marginTop: 4 },
  studentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  studentText: { fontSize: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  chipText: { color: "#fff", fontWeight: "bold" },
  present: { backgroundColor: "#2ECC71" },
  absent: { backgroundColor: "#E74C3C" },
});
