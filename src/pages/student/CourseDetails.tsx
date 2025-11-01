import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, CheckCircle, TrendingUp } from "lucide-react";

const CourseDetails = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const courseInfo = {
    title: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. James Anderson",
    section: "Section A",
    credits: 3,
    semester: "Fall 2024",
  };

  const activities = [
    { title: "Programming Assignment 1", type: "Assignment", dueDate: "2025-01-25", status: "pending", score: null, maxScore: 100 },
    { title: "Midterm Exam", type: "Exam", dueDate: "2025-01-20", status: "graded", score: 85, maxScore: 100 },
    { title: "Quiz 1: Data Structures", type: "Quiz", dueDate: "2025-01-15", status: "graded", score: 45, maxScore: 50 },
    { title: "Group Project Proposal", type: "Project", dueDate: "2025-01-12", status: "graded", score: 92, maxScore: 100 },
  ];

  const latestGrade = activities.find(a => a.status === "graded");

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <Button variant="ghost" onClick={() => navigate("/student/courses")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{courseInfo.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {courseInfo.code} - {courseInfo.section} | {courseInfo.credits} Credits
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-1">
                    Instructor: {courseInfo.instructor}
                  </p>
                </div>
                <Badge variant="secondary">{courseInfo.semester}</Badge>
              </div>
            </CardHeader>
          </Card>

          {latestGrade && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Latest Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{latestGrade.title}</p>
                    <p className="text-sm text-muted-foreground">{latestGrade.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      {latestGrade.score}/{latestGrade.maxScore}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {((latestGrade.score / latestGrade.maxScore) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Activities
              </CardTitle>
              <CardDescription>All assignments, exams, and projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.status === "graded" ? "bg-success/10" : "bg-warning/10"
                      }`}>
                        {activity.status === "graded" ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <Clock className="h-5 w-5 text-warning" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.type}</p>
                        <p className="text-xs text-muted-foreground">Due: {activity.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {activity.score !== null ? (
                        <div className="text-right mr-2">
                          <p className="font-semibold text-lg">
                            {activity.score}/{activity.maxScore}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {((activity.score / activity.maxScore) * 100).toFixed(0)}%
                          </p>
                        </div>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        {activity.status === "pending" ? "Submit" : "View"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
