import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Courses = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "teacher") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const courses = [
    { title: "Mathematics 101", section: "Grade 10-A", students: 28, status: "approved" },
    { title: "Advanced Math", section: "Grade 11-A", students: 25, status: "approved" },
    { title: "Geometry", section: "Grade 10-B", students: 30, status: "pending" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground">Manage your teaching courses</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="course-title">Course Title</Label>
                  <Input id="course-title" placeholder="Enter course title" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Course description" rows={3} />
                </div>
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Input id="section" placeholder="e.g., Grade 10-A" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Note: New courses require admin approval
                </p>
                <Button className="w-full">Submit for Approval</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <Badge
                    variant={course.status === "approved" ? "default" : "secondary"}
                    className={course.status === "approved" ? "bg-success text-success-foreground" : ""}
                  >
                    {course.status}
                  </Badge>
                </div>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.section}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-semibold">{course.students}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Course
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

export default Courses;
