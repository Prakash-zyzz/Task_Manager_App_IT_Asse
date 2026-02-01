import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { v4 as uuid } from "uuid";


function normalizeDate(value) {
  if (!value) return null;

  // Firestore Timestamp
  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  // ISO string
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d) ? null : d;
  }

  return null;
}


const tasksRef = () =>
  collection(db, "users", auth.currentUser.uid, "tasks");


export async function getTasks() {
  if (!auth.currentUser) return [];

  const snap = await getDocs(tasksRef());

  return snap.docs.map(d => {
    const data = d.data();

    return {
      id: d.id,
      ...data,
      createdAt: normalizeDate(data.createdAt),
      updatedAt: normalizeDate(data.updatedAt),
      completedAt: normalizeDate(data.completedAt),
    };
  });
}


export async function getTaskById(id) {
  if (!auth.currentUser) return null;

  const ref = doc(db, "users", auth.currentUser.uid, "tasks", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    id: snap.id,
    ...data,
    createdAt: normalizeDate(data.createdAt),
    updatedAt: normalizeDate(data.updatedAt),
    completedAt: normalizeDate(data.completedAt),
  };
}


export function addTask({ title, description, dueDate }) {
  if (!auth.currentUser) return null;

  const tempId = uuid();

  
  addDoc(tasksRef(), {
    title,
    description: description || "",
    dueDate: dueDate || null,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }).catch(console.error);

  
  return {
    id: tempId,
    title,
    description: description || "",
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null
  };
}


export function toggleTask(id, currentCompleted) {
  if (!auth.currentUser) return null;

  const updated = !currentCompleted;

  updateDoc(
    doc(db, "users", auth.currentUser.uid, "tasks", id),
    {
      completed: updated,
      completedAt: updated ? serverTimestamp() : null,
      updatedAt: serverTimestamp()
    }
  ).catch(console.error);

  return updated;
}


export function updateTask(task) {
  if (!auth.currentUser) return;

  updateDoc(
    doc(db, "users", auth.currentUser.uid, "tasks", task.id),
    {
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate || null,
      completed: task.completed,
      completedAt: task.completed ? serverTimestamp() : null,
      updatedAt: serverTimestamp()
    }
  ).catch(console.error);
}


export function deleteTask(id) {
  if (!auth.currentUser) return;

  deleteDoc(
    doc(db, "users", auth.currentUser.uid, "tasks", id)
  ).catch(console.error);
}


