import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Users, ClipboardList, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CourseManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "teacher") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const courseInfo = {
    title: "Introduction to Computer Science",
    code: "CS101",
    section: "Section A",
    students: 35,
  };

  const activities = [
    { title: "Programming Assignment 1", type: "Assignment", dueDate: "2025-01-25", submissions: 28, graded: 20 },
    { title: "Midterm Exam", type: "Exam", dueDate: "2025-01-20", submissions: 35, graded: 35 },
    { title: "Quiz 1: Data Structures", type: "Quiz", dueDate: "2025-01-15", submissions: 33, graded: 33 },
  ];

  const students = [
    { id: "2024001", name: "Sarah Johnson", email: "sarah.j@university.edu", status: "active" },
    { id: "2024002", name: "Michael Chen", email: "m.chen@university.edu", status: "active" },
    { id: "2024003", name: "Emily Rodriguez", email: "e.rodriguez@university.edu", status: "active" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <Button variant="ghost" onClick={() => navigate("/teacher/courses")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{courseInfo.title}</h1>
          <p className="text-muted-foreground">{courseInfo.code} - {courseInfo.section}</p>
        </div>

        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Activities
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Activity</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="activity-title">Activity Title</Label>
                          <Input id="activity-title" placeholder="Enter activity title" />
                        </div>
                        <div>
                          <Label htmlFor="activity-type">Type</Label>
                          <Select>
                            <SelectTrigger id="activity-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="assignment">Assignment</SelectItem>
                              <SelectItem value="quiz">Quiz</SelectItem>
                              <SelectItem value="exam">Exam</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="max-score">Maximum Score</Label>
                          <Input id="max-score" type="number" placeholder="100" />
                        </div>
                        <div>
                          <Label htmlFor="due-date">Due Date</Label>
                          <Input id="due-date" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea id="instructions" placeholder="Activity instructions" rows={3} />
                        </div>
                        <Button className="w-full">Create Activity</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.type}</p>
                        </div>
                        <Badge variant="secondary">{activity.dueDate}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Graded: {activity.graded}/{activity.submissions}
                        </span>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Students
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Student to Course</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="student-search">Search Student</Label>
                          <Input id="student-search" placeholder="Enter student ID or name" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Note: Student addition requires admin approval
                        </p>
                        <Button className="w-full">Send Request</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>Total: {courseInfo.students} students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.id}</p>
                      </div>
                      <Badge variant="secondary">{student.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
