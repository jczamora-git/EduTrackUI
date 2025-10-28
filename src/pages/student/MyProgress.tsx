import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp } from "lucide-react";

const MyProgress = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const progress = [
    { course: "Mathematics 101", completed: 18, total: 24, percentage: 75, trend: "+5%" },
    { course: "Science 101", completed: 20, total: 24, percentage: 83, trend: "+8%" },
    { course: "English Literature", completed: 16, total: 24, percentage: 67, trend: "+3%" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Progress</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Overall Progress
            </CardTitle>
            <CardDescription>Your completion status across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {progress.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.course}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.completed} of {item.total} activities completed
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-success">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-semibold">{item.trend}</span>
                      </div>
                      <span className="text-xl font-bold">{item.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Your attendance record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Days Present</span>
                  <span className="font-semibold">42/45</span>
                </div>
                <Progress value={93} className="h-2" />
                <p className="text-sm text-success">Excellent attendance! Keep it up.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission Rate</CardTitle>
              <CardDescription>On-time assignment submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">On-Time Submissions</span>
                  <span className="font-semibold">28/30</span>
                </div>
                <Progress value={93} className="h-2" />
                <p className="text-sm text-success">Great time management!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyProgress;
