import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, UserMinus } from "lucide-react";

const StudentManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "teacher") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const students = [
    { name: "Sarah Davis", email: "sarah@edu.com", course: "Mathematics 101", grade: "A", attendance: "95%" },
    { name: "Emily Brown", email: "emily@edu.com", course: "Mathematics 101", grade: "B+", attendance: "92%" },
    { name: "Mike Johnson", email: "mike@edu.com", course: "Advanced Math", grade: "A-", attendance: "88%" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Students</h1>
            <p className="text-muted-foreground">Add or remove students from your classes</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Students in Your Classes</CardTitle>
                <CardDescription>Manage enrolled students</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <p className="text-xs text-muted-foreground">{student.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold">Grade: {student.grade}</p>
                      <p className="text-xs text-muted-foreground">Attendance: {student.attendance}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentManagement;
