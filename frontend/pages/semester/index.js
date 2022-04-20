import Card from "../../components/Card";
import SemesterCourse from "../../courseSemester.json";
import UserRoute from "../../components/routes/UserRoute";

export default function Semester() {
  return (
    <UserRoute>
      <div className="container-md ">
        <h2>Semesters:</h2>

        <div className="row row-cols-1 row-cols-md-5 g-4">
          {SemesterCourse?.map((semester, index) => (
            <Card
              key={index}
              size={250}
              url={`semester/${semester?.title}`}
              cardTitle={`${semester?.title}`}
            />
          ))}
        </div>
      </div>
    </UserRoute>
  );
}
