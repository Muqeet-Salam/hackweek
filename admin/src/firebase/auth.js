import { GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./config";

const githubProvider = new GithubAuthProvider();

// LOGIN
export const loginWithGitHub = async () => {
  const result = await signInWithPopup(auth, githubProvider);
  return result;
};

// LOGOUT
export const logoutUser = async () => {
  return signOut(auth);
};