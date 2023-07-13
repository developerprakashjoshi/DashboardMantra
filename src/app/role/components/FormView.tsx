import { useMemo, useEffect } from "react";
import { useFormik, Field, Form, ErrorMessage, Formik } from "formik";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";

import RoleService from "@/api/services/role.service";
import { roleSchema } from "../validation/role.schema";
import Role from "@/api/models/role";

const FormView = () => {
  const roleService = new RoleService();
  const queryClient = useQueryClient();
  const { data: editRole } = useQuery<Role>("editRole",{ enabled: false,staleTime: Infinity});

  const initialValues = useMemo(() => {
    return {
      id: editRole?.id || "",
      name: editRole?.name || "",
      description: editRole?.description || "",
    };
  }, [editRole]);

  useEffect(() => {
    initialValues.name = editRole?.name || "";
    initialValues.description = editRole?.description || "";
  }, [editRole, initialValues]);

  const mutationKey = [
    editRole?.id ? "updateRole" : "addNewRole",
  ];
  const { mutateAsync, isLoading } = useMutation<Role, Error, Role>(
    mutationKey,
     editRole?.id ? updateRole : createRole,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("roles");
        editRole?.id ?
        toast.success("Role updated successfully"):
        toast.success("Role created successfully");
        queryClient.removeQueries('editRole');
        
      },
      onMutate: async (newRole: Role) => {
        if ( editRole?.id) {
          await queryClient.cancelQueries(["role"]);
          const previousRole = queryClient.getQueryData(["role",  editRole?.id]);
          queryClient.setQueryData(["role",  editRole?.id], { data: [newRole] });
          return { previousRole };
        }
      },
      onError: (error: Error, newRole: Role, context: any) => {
        queryClient.setQueryData(["role",  editRole?.id], context.previousRole);
        toast.error(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["role",  editRole?.id]);
      },
    }
  );
   
  async function createRole(role: Role): Promise<Role> {
    const response = await roleService.create(role);
    return response.data;
  }

  async function updateRole(role: Role): Promise<Role> {
    const response = await roleService.update( editRole?.id, role);
    return response.data;
  }

 const handleSubmit = async (values: Role, { resetForm }: { resetForm: () => void }) => {  
  await mutateAsync(values);
  resetForm();
};

 const handleReset = async (values: Role,{ resetForm }: { resetForm: () => void }) => {  
    // resetForm()
};

  return (
    <>
      <ToastContainer />
      <Formik
        enableReinitialize
        initialValues={editRole || { name: "", description: "" }}
        validationSchema={roleSchema}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >

        <Form className="max-w-md mx-auto">
            
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name:
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter name"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description:
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              rows={4}
              placeholder="Enter description"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." :(editRole?.id? "Update":"Save")}
          </button>
           <button
                type="reset"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-1"
            >
               Cancel
            </button>
        </Form>
      </Formik>
    </>
  );
};

export default FormView;
