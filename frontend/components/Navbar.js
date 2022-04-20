import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../context";
import PostForm from "../components/forms/PostForm";
import { Avatar } from "antd";

const Navbar = () => {
  const router = useRouter();
  const [state, setState] = useContext(UserContext);
  const getUser = state !== null;

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push(`/`);
  };

  const guestLinks = (
    <>
      <Link href={`/register`}>
        <a className="nav-link text-white fst-italic">Register</a>
      </Link>
    </>
  );

  const authLinks = (
    <>
      <div className="d-flex justify-content-between">
        <Link href={`#!`}>
          <a className="nav-link active text-white fst-italic fw-bold mt-1">
            {state?.user?.username}
          </a>
        </Link>
        <div className="mt-1">
          <PostForm />
        </div>
      </div>
      <Link href={`#!`}>
        <a className="nav-link active text-white fst-italic" onClick={logout}>
          Logout
        </a>
      </Link>
    </>
  );

  return (
    <nav className="nav d-flex justify-content-between nav-dark bg-secondary sticky-top py-2">
      <Link href={`/semester`}>
        <a className="nav-link active text-white fw-bold fst-italic">
          {" "}
          <Avatar src="/images/logo.png" /> Exam Collection
        </a>
      </Link>
      {getUser ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;
