import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";

const MyCourses = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const courses = [
    { title: "Mathematics 101", teacher: "John Smith", section: "Grade 10-A", progress: 75, grade: "A" },
    { title: "Science 101", teacher: "Dr. Sarah Lee", section: "Grade 10-A", progress: 82, grade: "A-" },
    { title: "English Literature", teacher: "Ms. Emily Clark", section: "Grade 10-A", progress: 68, grade: "B+" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">View all your enrolled courses</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {course.teacher}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Section</span>
                    <Badge variant="secondary">{course.section}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Grade</span>
                    <Badge className="bg-success text-success-foreground">{course.grade}</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
