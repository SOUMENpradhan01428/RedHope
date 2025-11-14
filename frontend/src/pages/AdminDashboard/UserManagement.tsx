
import React from "react";
import { useTheme } from "../../context/ThemeContext";

type User = {
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  joined: string;
};

const users: User[] = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    role: "Donor",
    status: "Active",
    joined: "2023-06-15",
  },
  {
    name: "General Hospital",
    email: "admin@generalhospital.com",
    role: "Hospital",
    status: "Active",
    joined: "2023-03-20",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "Donor",
    status: "Active",
    joined: "2023-08-10",
  },
  {
    name: "System Admin",
    email: "admin@RedHope.com",
    role: "Admin",
    status: "Active",
    joined: "2023-01-01",
  },
  {
    name: "City Medical Center",
    email: "contact@citymedical.com",
    role: "Hospital",
    status: "Inactive",
    joined: "2023-09-05",
  },
];

const UserManagement: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`p-5 rounded-xl shadow-sm border transition-colors ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-700"
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">👤 User Management</h3>
      <input
        className={`border rounded-lg p-2 w-full mb-4 transition-colors ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400"
            : "bg-white border-gray-300 text-gray-800"
        }`}
        placeholder="Search users..."
      />

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr
            className={`border-b ${
              darkMode ? "border-gray-700 bg-gray-900" : "bg-gray-100"
            }`}
          >
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Role</th>
            <th className="text-left p-2">Status</th>
            <th className="p-2">Joined</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, i) => (
            <tr
              key={i}
              className={`border-b hover:opacity-80 ${
                darkMode
                  ? "border-gray-700 hover:bg-gray-900"
                  : "hover:bg-gray-50"
              }`}
            >
              <td className="p-2">{user.name}</td>
              <td className="p-2 text-gray-500">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="p-2">{user.joined}</td>
              <td className="p-2 text-center cursor-pointer">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
