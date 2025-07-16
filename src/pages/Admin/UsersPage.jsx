// src/pages/admin/UsersPage.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../store/slices/usersSlice";
import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import Loading from "../../components/Loader/Loading";

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { list: users, status, error } = useSelector((s) => s.users);

  useEffect(() => {
    if (status === "idle") dispatch(fetchUsers());
  }, [status, dispatch]);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("");

  return (
    <DashboardLayout activeMenu="Users">
      <div className="mt-6 w-auto sm:max-w-[900px] mx-auto">
        {/* Card container */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200/50 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
            <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
              {users.length} total
            </span>
          </div>

          {/* Loading / Error */}
          {status === "loading" && (
            <div className="flex justify-center py-10">
              <Loading />
            </div>
          )}
          {status === "failed" && (
            <p className="text-center text-red-500 py-4">
              Error loading users: {error}
            </p>
          )}
          {status === "succeeded" && users.length === 0 && (
            <p className="text-center text-gray-500 py-4">No users found.</p>
          )}

          {/* Users Table */}
          {status === "succeeded" && users.length > 0 && (
            <div className="w-full flex flex-wrap">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 hidden md:table-cell">
                      Avatar
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 hidden md:table-cell">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((u, idx) => (
                    <tr
                      key={u._id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 hidden md:table-cell">
                        {u.profileImageUrl ? (
                          <img
                            src={u.profileImageUrl}
                            alt={u.name}
                            crossOrigin="anonymous"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                            {getInitials(u.name)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 break-all">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === "admin"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
