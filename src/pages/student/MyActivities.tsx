import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, CheckCircle } from "lucide-react";

const MyActivities = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const activities = [
    { title: "Quiz 1: Algebra", course: "Mathematics 101", dueDate: "2025-01-25", status: "pending", score: null },
    { title: "Science Lab Report", course: "Science 101", dueDate: "2025-01-22", status: "submitted", score: "45/50" },
    { title: "Essay: Shakespeare", course: "English Literature", dueDate: "2025-01-20", status: "graded", score: "88/100" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Activities</h1>
          <p className="text-muted-foreground">View and submit course activities</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              All Activities
            </CardTitle>
            <CardDescription>Track your assignments and assessments</CardDescription>
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
                      activity.status === "graded" ? "bg-success/10" :
                      activity.status === "submitted" ? "bg-warning/10" :
                      "bg-primary/10"
                    }`}>
                      {activity.status === "graded" ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <Clock className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.course}</p>
                      <p className="text-xs text-muted-foreground">Due: {activity.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {activity.score && (
                      <div className="text-right mr-2">
                        <p className="font-semibold">{activity.score}</p>
                      </div>
                    )}
                    <Badge
                      variant={
                        activity.status === "graded" ? "default" :
                        activity.status === "submitted" ? "secondary" :
                        "outline"
                      }
                      className={
                        activity.status === "graded" ? "bg-success text-success-foreground" :
                        activity.status === "submitted" ? "bg-warning text-warning-foreground" :
                        ""
                      }
                    >
                      {activity.status}
                    </Badge>
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
  );
};

export default MyActivities;
