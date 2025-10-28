import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Download } from "lucide-react";

const PDFGeneration = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">PDF Generation</h1>
          <p className="text-muted-foreground">Generate report cards and documents</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate Report Card
              </CardTitle>
              <CardDescription>Create PDF report cards for students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Academic Period</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="q1">First Quarter</SelectItem>
                      <SelectItem value="q2">Second Quarter</SelectItem>
                      <SelectItem value="q3">Third Quarter</SelectItem>
                      <SelectItem value="q4">Fourth Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Student</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student1">Sarah Davis</SelectItem>
                      <SelectItem value="student2">Emily Brown</SelectItem>
                      <SelectItem value="all">All Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report Card
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Q1 Report - Sarah Davis", "Q1 Report - All Students", "Q4 Report - Emily Brown"].map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <p className="font-medium">{report}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
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

export default PDFGeneration;
