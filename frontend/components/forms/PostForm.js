import React, {
  Fragment,
  useState,
  useRef,
  useContext,
  useEffect,
} from "react";
import { Modal, DatePicker, Space, Avatar } from "antd";
import courseSemester from "../../courseSemester.json";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../context";

const PostForm = () => {
  const [state, setState] = useContext(UserContext);

  const [semester, setSemester] = useState(courseSemester[0].title);
  const [course, setCourse] = useState("");
  const [dateString, setDateString] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [pdf, setPdf] = useState({});
  const pdfInputRef = useRef();

  const handleDate = (date, dateString) => {
    setDateString(dateString);
  };

  const handlePdf = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("pdf", file);

    try {
      const { data } = await axios.post(`/upload-pdf`, formData);
      setPdf({ url: data.url, public_id: data.public_id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`/create-post`, {
        semester,
        course,
        dateString,
        pdf,
      });
      if (data?.error) {
        toast.error(data?.error, {
          theme: "colored",
          hideProgressBar: true,
          autoClose: 1500,
        });
      } else {
        toast.success("Upload was successful", {
          theme: "colored",
          hideProgressBar: true,
          autoClose: 1500,
        });

        setSemester(courseSemester[0].title);
        setCourse("");
        setDateString("");
        setPdf(null);
        pdfInputRef.current.value = "";
        setIsModalVisible(false);
        setState({ ...state, pdfUploadToggle: !state.pdfUploadToggle });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="container-fluid">
      <button onClick={showModal} className="btn btn-primary" type="submit">
        Upload exam pdf
      </button>
      <>
        <Modal
          animation={false}
          destroyOnClose={true}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          title="Upload exam question in pdf format"
          footer={null}
        >
          <>
            <form onSubmit={handleSubmit} className="container-fluid">
              <label>
                Please select the semester...
                <div className="row">
                  <select
                    className="form-select mb-1 mx-3 col"
                    aria-label=".form-select-sm example"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    {courseSemester?.map((sem, index) => (
                      <option value={sem?.title} key={index}>
                        {sem?.title}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select col mb-1"
                    aria-label=".form-select-sm example"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  >
                    <option value={" "}>Select course...</option>
                    {courseSemester
                      ?.filter((sem) => sem.title === `${semester}`)
                      .map((sem, index) => (
                        <Fragment key={index}>
                          {sem?.courses?.map((course) => (
                            <option value={course?.code} key={course?.code}>
                              {course?.code}
                            </option>
                          ))}
                        </Fragment>
                      ))}
                  </select>
                </div>
                <div className="row p-1">
                  <Space direction="vertical col">
                    <DatePicker
                      onChange={handleDate}
                      picker="year"
                      style={{ width: "100%" }}
                    />
                  </Space>
                  <div className="col">
                    <input
                      onChange={handlePdf}
                      ref={pdfInputRef}
                      className="form-control form-control-sm"
                      id="formFileSm"
                      type="file"
                      accept=".pdf"
                    />
                  </div>
                </div>
              </label>
              <div className="row p-3 ">
                <button
                  className="btn btn-primary col-12"
                  type="submit"
                  disabled={!course || !dateString || !pdf?.url}
                >
                  Upload
                </button>
              </div>
            </form>
          </>
        </Modal>
      </>
    </div>
  );
};

export default PostForm;
