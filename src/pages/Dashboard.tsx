import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, FileText, Edit, Trash, Check, X, LogOut, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { Worksheet, getUserWorksheets, updateWorksheet, deleteWorksheet } from "@/lib/worksheetService";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      loadWorksheets();
    }
  }, [user]);

  const loadWorksheets = async () => {
    if (!user) return;
    
    try {
      const userWorksheets = await getUserWorksheets(user.uid);
      setWorksheets(userWorksheets);
    } catch (error) {
      console.error('Error loading worksheets:', error);
      toast.error('Failed to load worksheets');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (worksheet: Worksheet) => {
    setEditingId(worksheet.id);
    setEditingTitle(worksheet.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
      console.error('Logout error:', error);
    }
  };

  const handleDelete = async (worksheetId: string) => {
    try {
      await deleteWorksheet(worksheetId);
      setWorksheets(worksheets.filter(w => w.id !== worksheetId));
      toast.success("Worksheet deleted successfully");
    } catch (error) {
      console.error('Error deleting worksheet:', error);
      toast.error("Failed to delete worksheet");
    }
  };

  const saveTitle = async (worksheetId: string) => {
    try {
      await updateWorksheet(worksheetId, { title: editingTitle });
      setWorksheets(
        worksheets.map((w) =>
          w.id === worksheetId ? { ...w, title: editingTitle } : w
        )
      );
      setEditingId(null);
      setEditingTitle("");
      toast.success("Title updated successfully");
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error("Failed to update title");
    }
  };

  const filteredWorksheets = worksheets.filter((worksheet) =>
    worksheet.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading worksheets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-worksheet-600 text-white font-bold text-xl">T</div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-worksheet-600 to-worksheet-800 text-transparent bg-clip-text">Work-Assign</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/faq">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-worksheet-600 to-worksheet-800 text-transparent bg-clip-text mb-1">My Worksheets</h2>
              <p className="text-gray-500 text-sm">Create, manage, and export your worksheets</p>
            </div>
            <Link to="/create">
              <Button className="bg-worksheet-600 hover:bg-worksheet-700 shadow-sm transition-all duration-200 hover:shadow">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Worksheet
              </Button>
            </Link>
          </div>

          {worksheets.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
              <div className="mb-4">
                <div className="w-16 h-16 rounded-full bg-worksheet-50 flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-worksheet-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">No worksheets yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Create your first worksheet to get started with Work-Assign's powerful worksheet generation tools.</p>
              <Link to="/create">
                <Button size="lg" className="bg-worksheet-600 hover:bg-worksheet-700 shadow-sm transition-all duration-200 hover:shadow">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Worksheet
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search worksheets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-200"
                />
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorksheets.map((worksheet) => (
                      <TableRow key={worksheet.id}>
                        <TableCell className="font-medium">
                          {editingId === worksheet.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                className="border-gray-200"
                              />
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => saveTitle(worksheet.id)}
                                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={cancelEditing}
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            worksheet.title
                          )}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {worksheet.updatedAt?.toDate().toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/edit/${worksheet.id}`}>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-gray-600 hover:text-gray-900"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => startEditing(worksheet)}
                              className="h-8 w-8 text-gray-600 hover:text-gray-900"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(worksheet.id)}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;