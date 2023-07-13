"use client";
import { useState,useEffect } from "react";
import Image from "next/image";
import { useQuery,useQueryClient } from "react-query";
import axios, { AxiosResponse } from "axios";

import RoleService from "@/api/services/role.service";
import Role from "@/api/models/role";
import LoaderProviders from "@/libs/loader-provider"

import ListView from "./components/ListView";
import FormView from "./components/FormView";
import TableView from "./components/TableView";
import  PageSliderLoader  from "./components/PageSliderLoader";



export default function About() {
  const [progress, setProgress] = useState(0);
     useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 95) {
        setProgress(progress + 5);
      } else {
        clearInterval(timer);

      }
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  useEffect(() => {
    const handlePageUnload = () => {
      setProgress(100);
    };

    window.onbeforeunload = handlePageUnload;

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  let roleService = new RoleService();
  let id = 1;
  

  const onSuccess = (data: Role[]) => {
    console.log("Data fetched successfully:", data);
  };
  const onError = (err: Error) => {
    console.error("An error occurred:", err);
  };

  const { isLoading, isSuccess, isError, data, error, refetch } = useQuery<Role[],Error>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response: AxiosResponse<Role[]> = await roleService.list();
      return response.data;
    },
    enabled: true,
    retry: 2,
    onSuccess,
    onError,
  });

  if (isLoading) {
    return <LoaderProviders/>;
  }
  if (isError) {
    return <div>Error: {error.message});</div>;
  }
  return (
    <>
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="">
          <h1 className="text-xl font-semibold">Roles List</h1>
        </div>
        <div className="mt-4">
          {/* <TableView roles={data ?? []} /> */}
        </div>
      </main>
    </div>
      
      <FormView />
      {/* <ListView roles={data ?? []} /> */}
    </>
  );
}
