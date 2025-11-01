import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, ClipboardList } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Activities = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "teacher") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const activities = [
    { title: "Programming Assignment 1", course: "CS101", section: "Section A", type: "Assignment", dueDate: "2025-01-25", submissions: 28, totalStudents: 35 },
    { title: "Midterm Exam", course: "CS201", section: "Section B", type: "Exam", dueDate: "2025-01-22", submissions: 28, totalStudents: 28 },
    { title: "Research Paper", course: "CS301", section: "Section A", type: "Project", dueDate: "2025-01-20", submissions: 25, totalStudents: 30 },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Activities</h1>
            <p className="text-muted-foreground">View and manage all activities across courses</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              All Activities
            </CardTitle>
            <CardDescription>View and manage course activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.course} - {activity.section} | {activity.type}
                    </p>
                    <p className="text-xs text-muted-foreground">Due: {activity.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <p className="text-sm text-muted-foreground">Submissions</p>
                      <p className="font-semibold">{activity.submissions}/{activity.totalStudents}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate("/teacher/grades")}>
                      Grade
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

export default Activities;
