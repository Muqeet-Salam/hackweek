import { useState, useEffect } from "react";
import { subscribeToAdmins, createAdmin, deleteAdmin } from "../services/adminAuthService";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function AdminAccess() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAdmins((data) => {
      setAdmins(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    
    setIsCreating(true);
    try {
      await createAdmin(newUsername, newPassword);
      setNewUsername("");
      setNewPassword("");
      alert("Admin created successfully!");
    } catch (error) {
      alert("Failed to create admin.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAdmin = async (id, username) => {
    if (window.confirm(`Are you sure you want to delete admin '${username}'?`)) {
      try {
        await deleteAdmin(id);
      } catch (error) {
        alert("Failed to delete admin.");
      }
    }
  };

  if (loading) return <div className="text-2xl font-bold p-8 animate-pulse">Loading admins...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-6">Manage Admin Access</h2>
      
      <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_black] mb-12">
        <h3 className="text-2xl font-bold mb-4">Add New Admin</h3>
        <form onSubmit={handleCreateAdmin} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block font-bold mb-2">Username</label>
            <Input 
              required 
              type="text" 
              value={newUsername} 
              onChange={(e) => setNewUsername(e.target.value)} 
              placeholder="e.g. john_admin" 
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block font-bold mb-2">Password</label>
            <Input 
              required 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>
          <Button 
            type="submit" 
            disabled={isCreating} 
            className="bg-[#00B7FF] text-white shadow-[4px_4px_0_black] hover:shadow-[6px_6px_0_black] transition-transform hover:-translate-y-1 py-3 px-8 w-full md:w-auto"
          >
            {isCreating ? "Adding..." : "Add Admin"}
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Current Admins ({admins.length})</h3>
        <div className="grid gap-4">
          {admins.length === 0 ? (
            <p className="font-medium text-gray-600">No admins found.</p>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} className="border-4 border-black bg-white p-4 shadow-[4px_4px_0_black] flex justify-between items-center">
                <div>
                  <h4 className="text-xl font-bold">{admin.username}</h4>
                  <p className="text-sm text-gray-500">ID: {admin.id}</p>
                </div>
                <Button 
                  onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                  className="bg-[#FF595E] text-white py-2 px-4 shadow-[2px_2px_0_black] hover:shadow-[4px_4px_0_black] transition-transform hover:-translate-y-1"
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
