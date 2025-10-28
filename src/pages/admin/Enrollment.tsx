import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, CheckCircle, XCircle } from "lucide-react";

const Enrollment = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const enrollmentRequests = [
    { student: "Sarah Davis", course: "Mathematics 101", section: "Grade 10-A", status: "pending", date: "2025-01-20" },
    { student: "Emily Brown", course: "Science 101", section: "Grade 10-B", status: "pending", date: "2025-01-19" },
    { student: "Mike Johnson", course: "English 101", section: "Grade 11-A", status: "approved", date: "2025-01-18" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Enrollment Management</h1>
          <p className="text-muted-foreground">Manage student course enrollments</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">145</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment Requests</CardTitle>
            <CardDescription>Review and approve student enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enrollmentRequests.map((request, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{request.student}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.course} - {request.section}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={request.status === "pending" ? "secondary" : "default"}
                      className={request.status === "approved" ? "bg-success text-success-foreground" : ""}
                    >
                      {request.status}
                    </Badge>
                    {request.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" className="text-success">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
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

export default Enrollment;
