
import React, { useState, useEffect } from "react";
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
import { db } from "../../services/firebaseConfig";
import {  collection,  query,  where,  getDocs,  addDoc,  doc,  updateDoc,  serverTimestamp,} from "firebase/firestore";

export default function AttendanceScreen() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const classes = ["1", "2", "3", "4","5","6","7","8","9","10","11","12"];
  const sections = ["A", "B", "C", "D"];

  // state to show saving students..
  const [loading, setLoading] = useState(false);



  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === "present" ? "absent" : "present",
    }));
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Fetch students when class or section changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass && selectedSection) {
        try {
          const q = query(
            collection(db, "students"),
            where("className", "==", selectedClass),
            where("section", "==", selectedSection)
          );

          const querySnapshot = await getDocs(q);
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setStudents(data);
        } catch (error) {
          console.error("Error fetching students: ", error);
        }
      } else {
        setStudents([]);
        setAttendance({});
      }
    };

    fetchStudents();
  }, [selectedClass, selectedSection]);

  // Fetch attendance when date, class, or section changes
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedClass || !selectedSection) return;

      try {
        const dateKey = date.toDateString();
        const q = query(
          collection(db, "attendance"),
          where("className", "==", selectedClass),
          where("section", "==", selectedSection),
          where("date", "==", dateKey)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const record = snapshot.docs[0].data();
          const attObj = {};
          record.students.forEach((s) => {
            attObj[s.id] = s.status;
          });
          setAttendance(attObj);
        } else {
          // No attendance for this date yet → reset
          setAttendance({});
        }
      } catch (error) {
        console.error("Error fetching attendance: ", error);
      }
    };

    fetchAttendance();
  }, [date, selectedClass, selectedSection]);


const saveAttendance = async () => {
  try {
    if (!selectedClass || !selectedSection) {
      alert("Please select class and section first.");
      return;
    }

    if (students.length === 0) {
      alert("Oops!!😕 No students found for this class/section.");
      return;
    }

    setLoading(true);  // started savinggg

    const dateKey = date.toDateString();

    // check if attendance already exists
    const q = query(
      collection(db, "attendance"),
      where("className", "==", selectedClass),
      where("section", "==", selectedSection),
      where("date", "==", dateKey)
    );
    const existing = await getDocs(q);

    const record = {
      className: selectedClass,
      section: selectedSection,
      date: dateKey,
      students: students.map((stu) => ({
        id: stu.id,
        name: stu.name,
        status: attendance[stu.id] || "absent",
      })),
      createdAt: serverTimestamp(),
    };

    if (!existing.empty) {
      // Update the existing attendance document
      const docId = existing.docs[0].id;
      await updateDoc(doc(db, "attendance", docId), record);
      alert("✅ Attendance updated successfully!");
    } else {
      // Save new attendance
      await addDoc(collection(db, "attendance"), record);
      alert("✅ Attendance saved successfully!");
    }
  } catch (error) {
    console.error("Error saving attendance: ", error);
    alert("😕 Failed to save attendance.");
  } finally {
    setLoading(false); // stop loading...
  }
};



// present absent count..
const presentCount = students.filter(
  (stu) => attendance[stu.id] === "present"
).length;

const absentCount = students.length - presentCount;




  return (
    <View style={styles.container}>
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


{/* Present & Absent Feature...*/}
      <View style={{flexDirection:"row" ,justifyContent:"space-around",borderBottomWidth:1 , borderBottomColor:"lightgray",marginBottom:10}}>
        <View>
        <Text>Present : {presentCount}</Text>
        </View>

        <View>
        <Text style={{marginBottom:5}}>Absent : {absentCount} </Text>
        </View>
      </View>


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

        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>
            {selectedClass && selectedSection
              ? "No students found in this class & section 😕"
              : "Please select Class and Section."}
          </Text>
        }
        
      />

      {/* Save Button */}
     <TouchableOpacity
       style={styles.saveButton}
       onPress={saveAttendance}
       disabled={loading} // prevent double click
      >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save Attendance"}
          </Text>
     </TouchableOpacity>

    </View>  // main view endedd
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
  saveButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
});
