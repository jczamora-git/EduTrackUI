import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp } from "lucide-react";

const MyGrades = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const grades = [
    {
      course: "Mathematics 101",
      grades: [
        { activity: "Quiz 1", score: "48/50", percentage: 96, letter: "A" },
        { activity: "Midterm", score: "85/100", percentage: 85, letter: "B+" },
      ],
      overall: "A",
    },
    {
      course: "Science 101",
      grades: [
        { activity: "Lab Report 1", score: "45/50", percentage: 90, letter: "A-" },
        { activity: "Quiz 1", score: "42/50", percentage: 84, letter: "B" },
      ],
      overall: "A-",
    },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Grades</h1>
          <p className="text-muted-foreground">View your academic performance</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall GPA</p>
                  <p className="text-2xl font-bold">3.8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Grade</p>
                  <p className="text-2xl font-bold">A-</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">24/30</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {grades.map((courseGrade, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{courseGrade.course}</CardTitle>
                  <Badge className="bg-success text-success-foreground text-lg px-4 py-1">
                    {courseGrade.overall}
                  </Badge>
                </div>
                <CardDescription>Detailed grade breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courseGrade.grades.map((grade, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{grade.activity}</p>
                        <p className="text-sm text-muted-foreground">{grade.score}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{grade.percentage}%</p>
                        </div>
                        <Badge variant="secondary" className="min-w-[3rem]">
                          {grade.letter}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyGrades;
