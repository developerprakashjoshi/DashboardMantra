import { useQueryClient,useMutation } from 'react-query';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";

import RoleService from "@/api/services/role.service";
import Role from '@/api/models/role';


const ListView = ({ roles }: { roles: Role[] }) => {
  const queryClient = useQueryClient();
  let roleService = new RoleService();
  const deleteRole = async (id: number) => {
    await roleService.delete(id);
  };
  const { mutate: deleteRoleMutation } = useMutation(deleteRole, {
    onSuccess: () => {
      queryClient.invalidateQueries('roles');
       toast.success("Role deleted successfully");
    },
  });
  const handleEdit = (role: Role) => {
    queryClient.setQueryData(['editRole'], role);
  };

  const handleDelete = (id: number) => {
    deleteRoleMutation(id);
  };

  return (
    <>
     <ToastContainer />
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">List View</h2>
      <ul className="bg-white shadow-md rounded-md">
        {roles.map((role) => (
          <li key={role.id} className="flex items-center border-b last:border-b-0">
            <span className="flex-1 py-4 px-6">{role.name}</span>
            <button
              className="text-blue-500 hover:text-blue-700 p-2"
              onClick={() => handleEdit(role)}
            >
              <FaEdit />
            </button>
            <button
              className="text-red-500 hover:text-red-700 p-2"
              onClick={() => handleDelete(role.id)}
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default ListView;
