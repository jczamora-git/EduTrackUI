import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

const GradingSystem = () => {
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
          <h1 className="text-3xl font-bold mb-2">Grading System</h1>
          <p className="text-muted-foreground">Configure unified grading policies</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Grade Scale Configuration
              </CardTitle>
              <CardDescription>Define grade ranges and equivalents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Grade</Label>
                    <Input value="A" readOnly />
                  </div>
                  <div>
                    <Label>Min %</Label>
                    <Input type="number" defaultValue="90" />
                  </div>
                  <div>
                    <Label>Max %</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Grade</Label>
                    <Input value="B" readOnly />
                  </div>
                  <div>
                    <Label>Min %</Label>
                    <Input type="number" defaultValue="80" />
                  </div>
                  <div>
                    <Label>Max %</Label>
                    <Input type="number" defaultValue="89" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Grade</Label>
                    <Input value="C" readOnly />
                  </div>
                  <div>
                    <Label>Min %</Label>
                    <Input type="number" defaultValue="70" />
                  </div>
                  <div>
                    <Label>Max %</Label>
                    <Input type="number" defaultValue="79" />
                  </div>
                </div>
                <Button>Save Grading Scale</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Computation Settings</CardTitle>
              <CardDescription>Configure automatic grade calculation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quiz">Quiz Weight (%)</Label>
                  <Input id="quiz" type="number" defaultValue="30" />
                </div>
                <div>
                  <Label htmlFor="exam">Exam Weight (%)</Label>
                  <Input id="exam" type="number" defaultValue="40" />
                </div>
                <div>
                  <Label htmlFor="project">Project Weight (%)</Label>
                  <Input id="project" type="number" defaultValue="30" />
                </div>
                <Button>Update Computation Rules</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GradingSystem;
