import { useState, useEffect } from "react";
import { getRegistrations } from "../services/adminRegistrationService";
import Badge from "../components/ui/Badge";

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const data = await getRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    
    const headers = ["Name", "Email", "Phone", "Type", "College/Company", "Degree/Role", "Year", "GitHub", "LinkedIn", "Portfolio"];
    
    const csvData = registrations.map(u => [
      `"${u.fullName || ''}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.participantType || ''}"`,
      `"${u.collegeName || u.companyName || ''}"`,
      `"${u.degree || u.role || ''}"`,
      `"${u.year || ''}"`,
      `"${u.githubProfile || ''}"`,
      `"${u.linkedin || ''}"`,
      `"${u.portfolio || ''}"`
    ].join(","));
    
    const csvString = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-2xl font-bold p-8">Loading registrations...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-4xl font-extrabold">Registered Participants</h2>
        <button
          onClick={handleExportCSV}
          className="bg-[#FFD23F] text-black font-bold border-4 border-black px-6 py-3 shadow-[4px_4px_0_black] hover:shadow-[6px_6px_0_black] transition-transform hover:-translate-y-1"
        >
          Export CSV ⬇️
        </button>
      </div>
      
      <div className="grid gap-6">
        {registrations.length === 0 ? (
          <div className="border-4 border-black bg-white p-8 font-bold text-xl">No participants found.</div>
        ) : (
          registrations.map((user) => (
            <div key={user.uid} className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black] flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold">{user.fullName}</h3>
                  <Badge variant={user.participantType === 'student' ? 'default' : 'success'}>
                    {user.participantType.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="font-medium text-gray-700">{user.email} • {user.phone}</p>
                
                {user.participantType === 'student' ? (
                  <p className="font-bold">{user.collegeName} (Year {user.year}) - {user.degree}</p>
                ) : (
                  <p className="font-bold">{user.role} at {user.companyName}</p>
                )}
                
                <div className="flex gap-4 mt-4 pt-4 border-t-2 border-dashed border-gray-300">
                  {user.githubProfile && (
                    <a href={user.githubProfile} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">GitHub</a>
                  )}
                  {user.linkedin && (
                    <a href={user.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">LinkedIn</a>
                  )}
                  {user.portfolio && (
                    <a href={user.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">Portfolio</a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
