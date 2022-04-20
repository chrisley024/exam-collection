import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Zoom } from "react-toastify";
import Head from "next/head";
import Navbar from "../components/Navbar";
import "antd/dist/antd.css";
import { UserProvider } from "../context";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <link rel="stylesheet" href="/css/style.css" />
        <title>Exam Collection</title>
        <meta name="description" />
        <link rel="icon" href="./images/favicon.png" />
      </Head>
      <Navbar />
      <ToastContainer position="top-center" transition={Zoom} />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
