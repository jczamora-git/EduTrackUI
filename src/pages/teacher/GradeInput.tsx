import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Save, Upload, Download } from "lucide-react";

const GradeInput = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "teacher") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  const students = [
    { id: "2024001", name: "Sarah Johnson", currentScore: null },
    { id: "2024002", name: "Michael Chen", currentScore: null },
    { id: "2024003", name: "Emily Rodriguez", currentScore: null },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <RoleBasedNav />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Grade Input</h1>
          <p className="text-muted-foreground">Input and manage student grades</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Activity</CardTitle>
              <CardDescription>Choose an activity to input grades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Course</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs101">CS101 - Introduction to Computer Science</SelectItem>
                    <SelectItem value="cs201">CS201 - Data Structures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Activity</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assignment1">Programming Assignment 1</SelectItem>
                    <SelectItem value="midterm">Midterm Exam</SelectItem>
                    <SelectItem value="quiz1">Quiz 1: Data Structures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Input</TabsTrigger>
              <TabsTrigger value="automatic">Automatic Import</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Student Grades - Manual Entry
                  </CardTitle>
                  <CardDescription>Input scores for each student individually</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.map((student, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Score"
                            className="w-24"
                            min="0"
                            max="100"
                            defaultValue={student.currentScore || ""}
                          />
                          <span className="text-muted-foreground">/ 100</span>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save All Grades
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="automatic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Import Grades from Excel
                  </CardTitle>
                  <CardDescription>Upload an Excel file to automatically import student grades</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-2">Upload Excel File</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supports .xlsx and .xls formats
                    </p>
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      className="max-w-xs mx-auto"
                    />
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Excel File Requirements:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Column A: Student ID</li>
                      <li>• Column B: Student Name</li>
                      <li>• Column C: Score</li>
                      <li>• First row should contain headers</li>
                    </ul>
                    <Button variant="link" size="sm" className="mt-2 h-auto p-0">
                      <Download className="h-3 w-3 mr-1" />
                      Download Template
                    </Button>
                  </div>
                  
                  <Button className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Process and Import Grades
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default GradeInput;
