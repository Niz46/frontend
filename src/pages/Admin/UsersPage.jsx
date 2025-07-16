// src/pages/admin/UsersPage.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../../store/slices/usersSlice';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import Loading from '../../components/Loader/Loading';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { list: users, status, error } = useSelector((s) => s.users);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchUsers());
  }, [status, dispatch]);

  // Helper to get initials if no profileImageUrl
  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0]?.toUpperCase())
      .join('');

  return (
    <DashboardLayout activeMenu="Users">
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200/50">
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>

        {status === 'loading' && <Loading />}

        {status === 'failed' && (
          <p className="text-red-500">Error: {error}</p>
        )}

        {status === 'succeeded' && users.length === 0 && (
          <p>No users found.</p>
        )}

        {status === 'succeeded' && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Avatar</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="px-4 py-2">
                      {u.profileImageUrl ? (
                        <img
                          src={u.profileImageUrl}
                          alt={u.name}
                          crossOrigin="anonymous"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                          {getInitials(u.name)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
