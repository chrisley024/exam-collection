import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import UserRoute from "../../../../components/routes/UserRoute";
import { UserContext } from "../../../../context";
import axios from "axios";
import moment from "moment";
import { Modal } from "antd";
import Image from "next/image";
import {
  CloudDownloadOutlined,
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CommentForm from "../../../../components/forms/CommentForm";

export default function CourseCode() {
  const router = useRouter();
  const { semesterName, courseCode } = router.query;
  const [state] = useContext(UserContext);
  const [examPdf, setExamPdf] = useState([]);
  // for comments
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentExamPdf, setCurrentExamPdf] = useState({});

  useEffect(() => {
    if (courseCode) fetchUploads();
  }, [courseCode, state?.pdfUploadToggle]);

  const fetchUploads = async () => {
    try {
      const { data } = await axios.get(`/uploads/${courseCode}`);
      setExamPdf(data);
    } catch (error) {
      console.log(error);
    }
  };

  const editImgUrl = (url) => {
    let removed = url.split(".").splice(0, 3).join(".");
    return `${removed}.png`;
  };

  const handleLike = async (_id) => {
    try {
      await axios.put("/like-post", { _id });

      fetchUploads();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnlike = async (_id) => {
    try {
      await axios.put("/unlike-post", { _id });

      fetchUploads();
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = (exam) => {
    setCurrentExamPdf(exam);
    setVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put("/add-comment", {
        examId: currentExamPdf._id,
        comment,
      });
      setComment("");
      setVisible(false);
      fetchUploads();
    } catch (error) {
      console.log(error);
    }
  };

  const removeComment = async (examId, comment) => {
    let answer = window.confirm("Sure you want to delete the comment?");
    if (!answer) return;
    try {
      const { data } = await axios.put("/remove-comment", {
        examId,
        comment,
      });
      fetchUploads();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <UserRoute>
        <div className="container pt-3">
          <h3 className="text-center">{courseCode}</h3>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {examPdf?.map((exam) => {
              return (
                <div className="col" key={exam._id}>
                  <div className="card ">
                    <div className="card-header">
                      <a
                        className="card-text fw-bold fst-italic"
                        href={exam.pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="show pdf"
                      >
                        <Image
                          src={editImgUrl(exam.pdf.url)}
                          className="card-img-top"
                          width="380"
                          height="250"
                        />
                      </a>
                    </div>
                    <div className="card-body d-flex justify-content-between text-center">
                      <p className="card-title fst-italic fw-bold">
                        {exam.dateString} session
                      </p>
                      <a
                        className="card-text fw-bold fst-italic"
                        href={exam.pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="show and download pdf"
                      >
                        <CloudDownloadOutlined
                          style={{ fontSize: "26px", color: "#DC3545" }}
                        />
                      </a>

                      <p className="card-text">
                        <small className="text-muted">
                          {moment(exam.createdAt).fromNow()}
                        </small>
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-between text-primary">
                      <p className="card-title">
                        <small className="text-muted">posted by</small>{" "}
                        {exam.postedBy.username}
                      </p>
                      <p>
                        {state?.user &&
                        exam?.likes?.includes(state.user._id) ? (
                          <HeartFilled
                            style={{ fontSize: "20px", color: "#DC3545" }}
                            onClick={() => handleUnlike(exam._id)}
                          />
                        ) : (
                          <HeartOutlined
                            style={{ fontSize: "20px", color: "#DC3545" }}
                            onClick={() => handleLike(exam._id)}
                          />
                        )}
                        &nbsp;
                        {exam?.likes?.length} likes
                      </p>
                      <p>
                        <CommentOutlined
                          style={{ fontSize: "20px", color: "#DC3545" }}
                          onClick={() => handleComment(exam)}
                        />
                        &nbsp;
                        {exam?.comments?.length} comments
                      </p>
                    </div>
                    {exam?.comments?.length > 0 && (
                      <ol
                        className="list-group"
                        style={{ maxHeight: "135px", overflow: "scroll" }}
                      >
                        {exam?.comments?.map((comment) => (
                          <li
                            key={comment._id}
                            className="list-group-item d-flex justify-content-between align-items-start"
                          >
                            <div className="ms-2 me-auto">
                              <div className="fw-bold fst-italic">
                                {comment.postedBy.username}:
                              </div>
                              <div>{comment.text}</div>
                            </div>
                            <span className="badge rounded-pill text-muted">
                              {moment(comment.created).fromNow()}
                              {state?.user?._id === comment?.postedBy?._id && (
                                <div className="mt-1">
                                  <DeleteOutlined
                                    className="pl-2 text-danger"
                                    onClick={() =>
                                      removeComment(exam._id, comment)
                                    }
                                  />
                                </div>
                              )}
                            </span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Modal
            destroyOnClose={true}
            visible={visible}
            onCancel={() => setVisible(false)}
            title="Comment"
            footer={null}
          >
            <CommentForm
              comment={comment}
              setComment={setComment}
              addComment={addComment}
            />
          </Modal>
        </div>
      </UserRoute>
    </>
  );
}
