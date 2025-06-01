import fetch from "node-fetch"; // if not installed, run: npm i node-fetch@2
import { firebaseAdmin } from "../services/firebase";

export async function getValidFirebaseIdToken() {
  const apiKey = process.env.FIREBASE_API_KEY;
  const email = process.env.FIREBASE_USER_EMAIL;
  const password = process.env.FIREBASE_USER_PASSWORD;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );
  const data = await response.json();

  if (!data.idToken) {
    throw new Error(`Failed to get ID token: ${JSON.stringify(data)}`);
  }

  return data.idToken;
}
