import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const SubjectAssignment = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const assignments = [
    { teacher: "John Smith", subject: "Mathematics", section: "Grade 10-A", students: 28 },
    { teacher: "Mike Wilson", subject: "Science", section: "Grade 10-B", students: 30 },
    { teacher: "John Smith", subject: "Physics", section: "Grade 11-A", students: 25 },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Subject & Section Assignment</h1>
          <p className="text-muted-foreground">Assign subjects and sections to teachers and students</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Assignment</CardTitle>
              <CardDescription>Assign a teacher to a subject and section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Teacher</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher1">John Smith</SelectItem>
                      <SelectItem value="teacher2">Mike Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Section</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10a">Grade 10-A</SelectItem>
                      <SelectItem value="10b">Grade 10-B</SelectItem>
                      <SelectItem value="11a">Grade 11-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Create Assignment</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Assignments</CardTitle>
              <CardDescription>View and manage existing assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{assignment.teacher}</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.subject} - {assignment.section}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{assignment.students} students</Badge>
                      <Button variant="outline" size="sm">
                        Edit
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

export default SubjectAssignment;
