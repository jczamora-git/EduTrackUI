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
    { title: "Quiz 1: Algebra", course: "Mathematics 101", type: "quiz", maxScore: 50, dueDate: "2025-01-25" },
    { title: "Midterm Exam", course: "Mathematics 101", type: "exam", maxScore: 100, dueDate: "2025-02-10" },
    { title: "Group Project", course: "Advanced Math", type: "project", maxScore: 100, dueDate: "2025-02-15" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Activities</h1>
            <p className="text-muted-foreground">Create and manage course activities</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Activity
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
                  <Label htmlFor="course">Course</Label>
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
                  <Label htmlFor="type">Activity Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
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
                <Button className="w-full">Create Activity</Button>
              </div>
            </DialogContent>
          </Dialog>
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
                    <p className="text-sm text-muted-foreground">{activity.course}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due: {activity.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{activity.type}</Badge>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{activity.maxScore} pts</p>
                      <p className="text-xs text-muted-foreground">max score</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
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
