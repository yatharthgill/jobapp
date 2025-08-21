import { useContext } from "react";
import AuthContext from "../context/Authcontext";

const useAuth = () => useContext(AuthContext);

export default useAuth;
