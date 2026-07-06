/*
  Firebase service layer.
  Keeps all Firestore operations in one place so UI code stays clean.
*/

import { firebaseConfig } from "./config.example.js";
import { getChallengeIds } from "./challenges.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const COLLECTION_NAME = "hackathonChallenges";

const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => {
  return typeof value === "string" && value.trim() !== "" && !value.includes("REPLACE_WITH_");
});

let db = null;

if (hasFirebaseConfig) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export function isFirebaseReady() {
  return Boolean(db);
}

export function listenChallengeClaims(onData, onError = console.error) {
  if (!db) {
    onData({});
    return () => {};
  }

  return onSnapshot(
    collection(db, COLLECTION_NAME),
    (snapshot) => {
      const claims = {};
      snapshot.forEach((documentSnapshot) => {
        claims[documentSnapshot.id] = {
          id: documentSnapshot.id,
          ...documentSnapshot.data()
        };
      });
      onData(claims);
    },
    (error) => {
      onError(error);
    }
  );
}

export async function claimChallenge(themeId, payload) {
  if (!db) {
    throw new Error("Firebase no esta configurado. Pega tus credenciales en config.example.js antes de reclamar retos.");
  }

  if (!getChallengeIds().includes(themeId)) {
    throw new Error("La tematica seleccionada no existe.");
  }

  const challengeRef = doc(db, COLLECTION_NAME, themeId);

  return runTransaction(db, async (transaction) => {
    const current = await transaction.get(challengeRef);

    if (current.exists()) {
      const data = current.data();
      if (data.status === "claimed") {
        throw new Error(`Este reto ya fue reclamado por ${data.teamName || "otro equipo"}.`);
      }
    }

    const cleanPayload = {
      themeId,
      themeLabel: payload.themeLabel,
      teamName: payload.teamName.trim(),
      leaderName: payload.leaderName.trim(),
      leaderEmail: payload.leaderEmail.trim().toLowerCase(),
      status: "claimed",
      claimedAt: serverTimestamp()
    };

    transaction.set(challengeRef, cleanPayload, { merge: false });
    return cleanPayload;
  });
}
