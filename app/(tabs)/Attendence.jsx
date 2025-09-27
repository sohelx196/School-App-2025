// AttendanceScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AttendanceScreen() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // today's date by default
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // handle date select
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Dropdowns */}
      <View style={styles.row}>
        <View style={styles.pickerWrap}>
          <Text style={styles.label}>Class</Text>
          <Picker
            selectedValue={selectedClass}
            onValueChange={setSelectedClass}
          >
            <Picker.Item label="Select class" value="" />
            {classes.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrap}>
          <Text style={styles.label}>Section</Text>
          <Picker
            selectedValue={selectedSection}
            onValueChange={setSelectedSection}
          >
            <Picker.Item label="Select section" value="" />
            {sections.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Date Selector */}
      <Text style={styles.title}>Select Date of Attendance :</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
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
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pickerWrap: {
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  label: { fontSize: 14, paddingLeft: 8, marginTop: 4 },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    backgroundColor: "#f6fbff",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  dateText: { color: "black", fontSize: 16, fontWeight: "bold" },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  studentText: { fontSize: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  chipText: { color: "#fff", fontWeight: "bold" },
  present: { backgroundColor: "#2ECC71" },
  absent: { backgroundColor: "#E74C3C" },
});
