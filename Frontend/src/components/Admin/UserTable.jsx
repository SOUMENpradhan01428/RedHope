import React from "react";

const UserTable = ({ users }) => {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b bg-gray-100">
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
          <tr key={i} className="border-b hover:bg-gray-50">
            <td className="p-2">{user.name}</td>
            <td className="p-2">{user.email}</td>
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
  );
};

export default UserTable;