import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import AuthForm from "../components/forms/AuthForm";
import { UserContext } from "../context";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [state, setState] = useContext(UserContext);

  const router = useRouter();
  if (state?.token) router.push(`/semester`);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(`/register`, {
        username,
        email,
        password,
      });
      setLoading(false);
      //update context
      setState({ ...state, user: data.user, token: data.token });
      // save in local storage
      window.localStorage.setItem("auth", JSON.stringify(data));
      toast.success("Registration was successful", {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });

      router.push(`/semester`);
    } catch (error) {
      toast.error(error?.response?.data, {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h3 className="fst-italic text-center pt-3">Register</h3>
          <AuthForm
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleSubmit={handleSubmit}
            page={"Register"}
          />
        </div>
      </div>
    </div>
  );
}
