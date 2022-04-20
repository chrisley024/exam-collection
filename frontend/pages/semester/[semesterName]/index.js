import { useRouter } from "next/router";
import { Fragment } from "react";
import UserRoute from "../../../components/routes/UserRoute";
import SemesterCourse from "../../../courseSemester.json";
import Card from "../../../components/Card";

export default function Course() {
  const router = useRouter();
  const semesterName = router.query.semesterName;

  return (
    <UserRoute>
      <div className="container-md">
        <h2>{semesterName}:</h2>

        <div className="row row-cols-1 row-cols-md-5 g-4">
          {SemesterCourse?.filter(
            (semester) => semester.title === `${semesterName}`
          ).map((semester, index) => (
            <Fragment key={index}>
              {semester?.courses?.map((course) => (
                <Card
                  key={course.code}
                  size={450}
                  url={`semester/${semesterName}/${course.code}`}
                  cardTitle={`${course.name} (${course.code})`}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </UserRoute>
  );
}
