import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Award, Save } from "lucide-react";

const GradeInput = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "teacher") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const students = [
    { name: "Sarah Davis", currentGrade: "45/50" },
    { name: "Emily Brown", currentGrade: "42/50" },
    { name: "Mike Johnson", currentGrade: "48/50" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Grade Input</h1>
          <p className="text-muted-foreground">Input and manage student grades</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Activity</CardTitle>
            <CardDescription>Choose an activity to input grades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Course</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math101">Mathematics 101</SelectItem>
                  <SelectItem value="advmath">Advanced Math</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Activity</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz1">Quiz 1: Algebra</SelectItem>
                  <SelectItem value="midterm">Midterm Exam</SelectItem>
                  <SelectItem value="project">Group Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Student Grades
            </CardTitle>
            <CardDescription>Input scores for each student</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Current: {student.currentGrade}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Score"
                      className="w-24"
                      min="0"
                      max="50"
                    />
                    <span className="text-muted-foreground">/ 50</span>
                  </div>
                </div>
              ))}
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save All Grades
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GradeInput;
