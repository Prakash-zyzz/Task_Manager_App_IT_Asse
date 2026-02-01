import { openDB } from "idb";
import { auth } from "./firebase";

export async function getUserDB() {
  const user = auth.currentUser;
  if (!user) return null;

  return openDB(`tasks-db-${user.uid}`, 1, {
    upgrade(db) {
      db.createObjectStore("tasks", { keyPath: "id" });
    }
  });
}

