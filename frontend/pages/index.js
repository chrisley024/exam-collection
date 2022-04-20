import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import AuthForm from "../components/forms/AuthForm";
import { UserContext } from "../context";

export default function Home() {
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
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });
      setLoading(false);

      toast.success("Login was successful", {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
      //update context
      setState({ ...state, user: data.user, token: data.token });
      // save in local storage
      window.localStorage.setItem("auth", JSON.stringify(data));
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
      <div className="row ">
        <div className="col-md-3 pt-5 ">
          <h4 className="fst-italic text-center pt-1">Login</h4>
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleSubmit={handleSubmit}
            page={"Login"}
          />
          <h6 className="text-center pt-3 ">
            Do not have an account?
            <Link href={`/register`}>
              <a className="text-decoration-none"> Sign Up</a>
            </Link>
          </h6>
        </div>

        <div className="col-md-9">
          <div
            className=""
            style={{
              backgroundImage: "url(/images/default.jpg)",
              backgroundAttachment: "fixed",
              padding: "100px 0px 200px 0px",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          >
            <p className="display-2 text-center fst-italic">
              Share your past exam questions to help your fellow students for
              exam prep...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
