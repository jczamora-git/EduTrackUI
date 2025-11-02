import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Save, ArrowLeft, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GradeInputEdit = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "teacher") {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  // Get parameters from URL
  const selectedCourse = searchParams.get("course") || "cs101";
  const selectedSection = searchParams.get("section") || "12-polaris";
  const selectedTerm = searchParams.get("term") || "midterm";
  const selectedSemester = searchParams.get("semester") || "1st";

  const courseInfo = {
    code: "CS101",
    title: "Introduction to the Philosophy of the Human",
    teacher: "Aleck Jean F. Siscar",
    section: "12-Polaris",
  };

  const [grades, setGrades] = useState([
    { id: "2024001", name: "Alagasi, Hyden Cristia A.", written: [10, 10, 91, 10, 8, 8, 38, 85], performance: [30, 15, 0, 0, 0], exam: 60 },
    { id: "2024002", name: "Algoy, Ann Ruslyn My Tolentino", written: [10, 10, 80, 8, 8, 8, 25, 85], performance: [30, 14, 0, 0, 0], exam: 31 },
    { id: "2024003", name: "Alvarez, Jezzabel Orallo", written: [10, 10, 84, 10, 8, 8, 25, 85], performance: [30, 15, 0, 0, 0], exam: 38 },
    { id: "2024004", name: "Ariola, Marienyque Angel R.", written: [10, 10, 98, 10, 8, 8, 45, 85], performance: [30, 15, 0, 0, 0], exam: 49 },
    { id: "2024005", name: "Austria, Jaila Marie Amiten", written: [10, 10, 88, 10, 8, 8, 32, 85], performance: [30, 13, 0, 0, 0], exam: 17 },
  ]);

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    name: 250,
    written: 80,
    performance: 80,
    exam: 80,
    writtentotal: 90,
    writtenps: 90,
    writtenws: 90,
    performancetotal: 90,
    performanceps: 90,
    performancews: 90,
    examps: 90,
    examws: 90,
    initial: 100,
    grade: 100,
  });

  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState(0);
  const [pinnedColumns, setPinnedColumns] = useState<string[]>(["name"]);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleOuterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // if the click happened inside the table wrapper, don't clear activeRow
    if (tableWrapperRef.current && tableWrapperRef.current.contains(e.target as Node)) return;
    setActiveRow(null);
  };

  const transmute = (percentage: number): string => {
    if (percentage >= 97) return "1.00";
    if (percentage >= 94) return "1.25";
    if (percentage >= 91) return "1.50";
    if (percentage >= 88) return "1.75";
    if (percentage >= 85) return "2.00";
    if (percentage >= 82) return "2.25";
    if (percentage >= 79) return "2.50";
    if (percentage >= 76) return "2.75";
    if (percentage >= 75) return "3.00";
    return "5.00";
  };

  const handleGradeChange = (studentIndex: number, category: 'written' | 'performance' | 'exam', itemIndex: number | null, value: string) => {
    const newGrades: any = [...grades];

    // If the input is empty, store null so DB-ready state can distinguish blank vs 0.
    const isEmpty = value === '' || value === null;

    if (category === 'exam') {
      newGrades[studentIndex].exam = isEmpty ? null : (parseFloat(value) || 0);
    } else if (itemIndex !== null) {
      newGrades[studentIndex][category][itemIndex] = isEmpty ? null : (parseFloat(value) || 0);
    }

    setGrades(newGrades);
  };

  const handleColumnMouseDown = (columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingColumn(columnId);
    setResizeStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!resizingColumn) return;
    
    const delta = e.clientX - resizeStart;
    const newWidth = Math.max(40, (columnWidths[resizingColumn] || 60) + delta);
    
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth
    }));
    
    setResizeStart(e.clientX);
  };

  const handleMouseUp = () => {
    setResizingColumn(null);
  };

  const handleDoubleClick = (columnId: string) => {
    const defaultWidths: Record<string, number> = {
      name: 250,
      written: 80,
      performance: 80,
      exam: 80,
      writtentotal: 90,
      writtenps: 90,
      writtenws: 90,
      performancetotal: 90,
      performanceps: 90,
      performancews: 90,
      examps: 90,
      examws: 90,
      initial: 100,
      grade: 100,
    };
    
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: defaultWidths[columnId] || 80
    }));
  };

  const toggleColumnPin = (columnId: string) => {
    if (columnId === 'name') return;
    
    setPinnedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(c => c !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSaveGrades = () => {
    alert("Grades saved successfully!");
    navigate(-1);
  };

  if (!isAuthenticated) return null;

  return (
      <div 
        className="h-screen flex flex-col p-4 bg-background"
        onClick={handleOuterClick}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Class Record</h1>
              <p className="text-sm text-muted-foreground">{courseInfo.code} - {selectedTerm === "midterm" ? "Midterm" : "Final Term"}</p>
            </div>
          </div>
          <Button onClick={handleSaveGrades}>
            <Save className="h-4 w-4 mr-2" />
            Save & Close
          </Button>
        </div>

        {/* Course Info Banner */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{courseInfo.code} - {courseInfo.title}</p>
                <p className="text-sm text-muted-foreground">Teacher: {courseInfo.teacher} | Section: {courseInfo.section}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {selectedSemester} Semester - {selectedTerm === "midterm" ? "Midterm" : "Final Term"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Students / Legend Indicator */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="text-sm font-medium">Total Students: {grades.length}</div>
          <div className="text-sm text-muted-foreground">HPS = Highest Possible Score • PS = Percentage Score • WS = Weighted Score</div>
        </div>

        {/* Class Record Table */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Full Edit View
                </CardTitle>
                <CardDescription>
                  Drag column borders to resize • Double-click to auto-fit • Click pin icon to lock columns
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            <div 
              ref={tableWrapperRef}
              className="overflow-x-auto overflow-y-auto flex-1 border rounded-lg"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <table className="border-collapse text-xs">
                <thead className="sticky top-0 z-20">
                  <tr className="border-b-2 border-border h-12">
                    <th 
                      className="p-2 text-left font-semibold sticky left-0 z-30 bg-background border-r border-border relative group"
                      style={{ width: `${columnWidths.name}px` }}
                    >
                      <div className="flex items-center justify-between">
                        <span>Learner's Name</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          title="Name column is always pinned"
                        >
                          <Pin className="h-3 w-3 text-primary fill-primary" />
                        </Button>
                      </div>
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('name', e)}
                        onDoubleClick={() => handleDoubleClick('name')}
                      />
                    </th>

                    {/* Written Works (30%) */}
                    <th colSpan={11} className="p-2 text-center font-semibold bg-blue-50 border-r border-border">
                      Written Works (30%)
                    </th>
                    {/* Performance (40%) */}
                    <th colSpan={8} className="p-2 text-center font-semibold bg-green-50 border-r border-border">
                      Performance Tasks (40%)
                    </th>
                    {/* Exam (30%) */}
                    <th colSpan={3} className="p-2 text-center font-semibold bg-amber-50 border-r border-border">
                      Exam (30%)
                    </th>
                    {/* Total */}
                    <th colSpan={2} className="p-2 text-center font-semibold bg-accent-50">
                      {selectedTerm === "midterm" ? "Midterm" : "Final Term"} Grade
                    </th>
                  </tr>

                  {/* Subheader with column names */}
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-2 text-left text-xs font-medium sticky left-0 z-30 bg-muted/50 border-r border-border" style={{ width: `${columnWidths.name}px` }}>ID / Name</th>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <th key={`w${i}`} className="p-1 text-center font-medium bg-blue-50/50 relative group" style={{ width: `${columnWidths.written}px` }}>
                        {i}
                        <div
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          onMouseDown={(e) => handleColumnMouseDown('written', e)}
                          onDoubleClick={() => handleDoubleClick('written')}
                        />
                      </th>
                    ))}
                    <th className="p-1 text-center font-medium bg-blue-50/50 relative group" style={{ width: `${columnWidths.writtentotal}px` }}>
                      Total
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('writtentotal', e)}
                        onDoubleClick={() => handleDoubleClick('writtentotal')}
                      />
                    </th>
                    <th className="p-1 text-center font-medium bg-blue-50/50 relative group" style={{ width: `${columnWidths.writtenps}px` }}>
                      PS
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('writtenps', e)}
                        onDoubleClick={() => handleDoubleClick('writtenps')}
                      />
                    </th>
                    <th className="p-1 text-center font-medium bg-blue-50 border-r border-border relative group" style={{ width: `${columnWidths.writtenws}px` }}>
                      WS
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('writtenws', e)}
                        onDoubleClick={() => handleDoubleClick('writtenws')}
                      />
                    </th>

                    {[1, 2, 3, 4, 5].map((i) => (
                      <th key={`p${i}`} className="p-1 text-center font-medium bg-green-50/50 relative group" style={{ width: `${columnWidths.performance}px` }}>
                        {i}
                        <div
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          onMouseDown={(e) => handleColumnMouseDown('performance', e)}
                          onDoubleClick={() => handleDoubleClick('performance')}
                        />
                      </th>
                    ))}
                    <th className="p-1 text-center font-medium bg-green-50/50 relative group" style={{ width: `${columnWidths.performancetotal}px` }}>
                      Total
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('performancetotal', e)}
                        onDoubleClick={() => handleDoubleClick('performancetotal')}
                      />
                    </th>
                    <th className="p-1 text-center font-medium bg-green-50/50 relative group" style={{ width: `${columnWidths.performanceps}px` }}>
                      PS
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('performanceps', e)}
                        onDoubleClick={() => handleDoubleClick('performanceps')}
                      />
                    </th>
                    <th className="p-1 text-center font-medium bg-green-50 border-r border-border relative group" style={{ width: `${columnWidths.performancews}px` }}>
                      WS
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('performancews', e)}
                        onDoubleClick={() => handleDoubleClick('performancews')}
                      />
                    </th>

                    <th className="p-1 text-center font-medium bg-amber-50/50 relative group" style={{ width: `${columnWidths.exam}px` }}>
                      Score
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('exam', e)}
                        onDoubleClick={() => handleDoubleClick('exam')}
                      />
                    </th>
                    <th className="p-1 text-center font-medium bg-amber-50/50 relative group" style={{ width: `${columnWidths.examps}px` }}>
                      PS
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('examps', e)}
                        onDoubleClick={() => handleDoubleClick('examps')}
                      />
                    </th>
                    <th className="p-1 text-center font-medium bg-amber-50 border-r border-border relative group" style={{ width: `${columnWidths.examws}px` }}>
                      WS
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('examws', e)}
                        onDoubleClick={() => handleDoubleClick('examws')}
                      />
                    </th>

                    <th className="p-1 text-center font-medium bg-accent-50/50 relative group" style={{ width: `${columnWidths.initial}px` }}>
                      Initial
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('initial', e)}
                        onDoubleClick={() => handleDoubleClick('initial')}
                      />
                    </th>
                    <th className="p-1 text-center font-medium bg-accent-50 relative group" style={{ width: `${columnWidths.grade}px` }}>
                      Grade
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleColumnMouseDown('grade', e)}
                        onDoubleClick={() => handleDoubleClick('grade')}
                      />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Highest Possible Score Row */}
                  <tr className="border-b border-border bg-muted/50">
                    <td className="p-2 text-left text-xs font-medium sticky left-0 z-20 bg-muted/50 border-r border-border" style={{ width: `${columnWidths.name}px` }}>
                      HPS
                    </td>

                    {/* Written HPS (subheader style) */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <td key={`hps-w${i}`} className="p-1 text-center text-xs font-medium bg-blue-50/50 border-r border-border" style={{ width: `${columnWidths.written}px` }}>
                        10
                      </td>
                    ))}
                    <td className="p-1 text-center text-xs font-medium bg-blue-50/50 border-r border-border" style={{ width: `${columnWidths.writtentotal}px` }}>
                      80
                    </td>
                    <td className="p-1 text-center text-xs font-medium bg-blue-50/50 border-r border-border" style={{ width: `${columnWidths.writtenps}px` }}>
                      100%
                    </td>
                    <td className="p-1 text-center text-xs font-medium bg-blue-50 border-r border-border" style={{ width: `${columnWidths.writtenws}px` }}>
                      30.00
                    </td>

                    {/* Performance HPS (subheader style) */}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <td key={`hps-p${i}`} className="p-1 text-center text-xs font-medium bg-green-50/50 border-r border-border" style={{ width: `${columnWidths.performance}px` }}>
                        {i === 1 ? '30' : '0'}
                      </td>
                    ))}
                    <td className="p-1 text-center text-xs font-medium bg-green-50/50 border-r border-border" style={{ width: `${columnWidths.performancetotal}px` }}>
                      45
                    </td>
                    <td className="p-1 text-center text-xs font-medium bg-green-50/50 border-r border-border" style={{ width: `${columnWidths.performanceps}px` }}>
                      100%
                    </td>
                    <td className="p-1 text-center text-xs font-medium bg-green-50 border-r border-border" style={{ width: `${columnWidths.performancews}px` }}>
                      40.00
                    </td>

                    {/* Exam HPS (subheader style) */}
                    <td className="p-1 text-center text-xs font-medium bg-amber-50/50 border-r border-border" style={{ width: `${columnWidths.exam}px` }}>
                      60
                    </td>
                    <td className="p-1 text-center text-xs font-medium bg-amber-50/50 border-r border-border" style={{ width: `${columnWidths.examps}px` }}>
                      100%
                    </td>
                    <td className="p-1 text-center text-xs font-medium bg-amber-50 border-r border-border" style={{ width: `${columnWidths.examws}px` }}>
                      30.00
                    </td>

                    {/* Totals HPS (subheader style) */}
                    <td className="p-1 text-center text-xs font-medium bg-accent-50/50 border-r border-border" style={{ width: `${columnWidths.initial}px` }}>
                      100.00
                    </td>
                    <td className="p-1 text-center text-xs font-medium bg-green-100 text-green-700" style={{ width: `${columnWidths.grade}px` }}>
                      1.00
                    </td>
                  </tr>

                  {grades.map((student, idx) => {
                    const writtenTotal = student.written.reduce((a, b) => a + (parseFloat(String(b)) || 0), 0);
                    const writtenPS = ((writtenTotal / 300) * 100).toFixed(2);
                    const writtenWS = parseFloat(((writtenTotal / 300) * 30).toFixed(2));
                    
                    const performanceTotal = student.performance.reduce((a, b) => a + (parseFloat(String(b)) || 0), 0);
                    const performancePS = ((performanceTotal / 45) * 100).toFixed(2);
                    const performanceWS = parseFloat(((performanceTotal / 45) * 40).toFixed(2));
                    
                    const examScore = parseFloat(String(student.exam)) || 0;
                    const examPS = ((examScore / 60) * 100).toFixed(2);
                    const examWS = parseFloat(((examScore / 60) * 30).toFixed(2));
                    
                    const initialGrade = writtenWS + performanceWS + examWS;
                    const finalGrade = transmute(initialGrade);

                    // when a row is active, set a background class that should override per-cell backgrounds
                    const rowBgClass = activeRow === idx ? 'bg-sky-200' : '';
                    
                    // Helper to check if a specific cell is focused or hovered
                    const getCellBgClass = (cellId: string) => {
                      if (focusedCell === cellId) return 'bg-white'; // white when focused
                      if (hoveredCell === cellId) return 'bg-white'; // white when hovered
                      return rowBgClass; // sky-200 when row active but cell not focused/hovered
                    };

                    return (
                      <tr
                        key={idx}
                        onClick={() => setActiveRow(idx)}
                        className={`border-b border-border transition-colors h-16 ${rowBgClass || 'hover:bg-muted/30'}`}
                      >
                        <td className={`p-2 sticky left-0 z-20 bg-background border-r border-border ${rowBgClass}`} style={{ width: `${columnWidths.name}px` }}>
                          <div>
                            <p className="font-medium text-xs">{idx + 1}. {student.name}</p>
                            <p className="text-[10px] text-muted-foreground">{student.id}</p>
                          </div>
                        </td>

                        {/* Written */}
                        {student.written.map((score, i) => {
                          const cellId = `w${idx}-${i}`;
                          return (
                          <td key={cellId} className={`p-0 text-center border-r border-border/50 transition-colors ${getCellBgClass(cellId)}`} style={{ width: `${columnWidths.written}px` }}>
                            <Input
                              type="number"
                              onFocus={() => {
                                setActiveRow(idx);
                                setFocusedCell(cellId);
                              }}
                              onBlur={() => setFocusedCell(null)}
                              onMouseEnter={() => setHoveredCell(cellId)}
                              onMouseLeave={() => setHoveredCell(null)}
                              onChange={(e) => handleGradeChange(idx, 'written', i, e.target.value)}
                                className="w-full h-14 text-xs text-center p-1 border-0 bg-transparent focus:bg-white focus:border focus:border-blue-300 focus:ring-0"
                                  value={score ?? ''}
                              min="0"
                            />
                          </td>
                          );
                        })}
                        <td className={`p-0 text-center font-semibold border-r border-border/50 transition-colors ${rowBgClass}`} style={{ width: `${columnWidths.writtentotal}px` }}>
                          <div className="text-xs py-5">{writtenTotal}</div>
                        </td>
                        <td className={`p-0 text-center font-medium border-r border-border/50 transition-colors ${rowBgClass}`} style={{ width: `${columnWidths.writtenps}px` }}>
                          <div className="text-xs py-5">{writtenPS}%</div>
                        </td>
                        <td className={`p-0 text-center font-semibold border-r border-border transition-colors ${rowBgClass}`} style={{ width: `${columnWidths.writtenws}px` }}>
                          <div className="text-xs py-5">{writtenWS.toFixed(2)}</div>
                        </td>

                        {/* Performance */}
                        {student.performance.map((score, i) => {
                          const cellId = `p${idx}-${i}`;
                          return (
                          <td key={cellId} className={`p-0 text-center border-r border-border/50 transition-colors ${getCellBgClass(cellId)}`} style={{ width: `${columnWidths.performance}px` }}>
                            <Input
                              type="number"
                              onFocus={() => {
                                setActiveRow(idx);
                                setFocusedCell(cellId);
                              }}
                              onBlur={() => setFocusedCell(null)}
                              onMouseEnter={() => setHoveredCell(cellId)}
                              onMouseLeave={() => setHoveredCell(null)}
                              onChange={(e) => handleGradeChange(idx, 'performance', i, e.target.value)}
                                className="w-full h-14 text-xs text-center p-1 border-0 bg-transparent focus:bg-white focus:border focus:border-green-300 focus:ring-0"
                                  value={score ?? ''}
                              min="0"
                            />
                          </td>
                          );
                        })}
                        <td className={`p-0 text-center font-semibold border-r border-border/50 transition-colors ${rowBgClass}`} style={{ width: `${columnWidths.performancetotal}px` }}>
                          <div className="text-xs py-5">{performanceTotal}</div>
                        </td>
                        <td className={`p-0 text-center font-medium border-r border-border/50 transition-colors ${rowBgClass}`} style={{ width: `${columnWidths.performanceps}px` }}>
                          <div className="text-xs py-5">{performancePS}%</div>
                        </td>
                        <td className={`p-0 text-center font-semibold border-r border-border transition-colors ${rowBgClass}`} style={{ width: `${columnWidths.performancews}px` }}>
                          <div className="text-xs py-5">{performanceWS.toFixed(2)}</div>
                        </td>

                        {/* Exam */}
                        <td className={`p-0 text-center border-r border-border/50 transition-colors ${getCellBgClass(`exam${idx}`)}`} style={{ width: `${columnWidths.exam}px` }}>
                          <Input
                            type="number"
                            value={student.exam ?? ''}
                            onFocus={() => {
                              setActiveRow(idx);
                              setFocusedCell(`exam${idx}`);
                            }}
                            onBlur={() => setFocusedCell(null)}
                            onMouseEnter={() => setHoveredCell(`exam${idx}`)}
                            onMouseLeave={() => setHoveredCell(null)}
                            onChange={(e) => handleGradeChange(idx, 'exam', null, e.target.value)}
                            className="w-full h-14 text-xs text-center p-1 border-0 bg-transparent focus:bg-white focus:border focus:border-amber-300 focus:ring-0"
                            min="0"
                          />
                        </td>
                        <td className={`p-0 text-center font-medium border-r border-border/50 transition-colors ${rowBgClass}`} style={{ width: `${columnWidths.examps}px` }}>
                          <div className="text-xs py-5">{examPS}%</div>
                        </td>
                        <td className={`p-0 text-center font-semibold border-r border-border transition-colors ${rowBgClass}`} style={{ width: `${columnWidths.examws}px` }}>
                          <div className="text-xs py-5">{examWS.toFixed(2)}</div>
                        </td>

                        {/* Totals */}
                        <td className={`p-0 text-center font-bold border-r border-border/50 transition-colors ${rowBgClass}`} style={{ width: `${columnWidths.initial}px` }}>
                          <div className="text-xs py-5">{initialGrade.toFixed(2)}</div>
                        </td>
                        <td className={`p-0 text-center font-bold ${parseFloat(finalGrade) <= 3.0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} transition-colors ${rowBgClass}`} style={{ width: `${columnWidths.grade}px` }}>
                          <div className="text-xs py-5">{finalGrade}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default GradeInputEdit;
