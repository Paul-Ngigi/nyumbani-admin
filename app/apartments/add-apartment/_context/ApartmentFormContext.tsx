"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClient from "@/lib/axios-client";
import { AxiosError, AxiosResponse } from "axios";
import { IApartment } from "@/interfaces/apartment.interface";

interface IApartmentUploadContext {
  createApartment: (options: Options) => void;
  updateApartment: (options: Options) => void;
  reloadApartent: (options: Options) => void;
  loading: boolean;
  apartment: IApartment;
  isError?: boolean;
  error?: Error | null;
}

interface Options {
  data: any;
  callback_url: string;
}

export const ApartmentUploadContext = React.createContext(
  {} as IApartmentUploadContext
);

interface ProviderProps {
  children: React.ReactNode;
}

export function ApartmentUploadProvider({ children }: ProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const apartment_id_string = searchParams.get("apartment_id");  

  //get product if product_id is present
  const productResponse = useQuery({
    queryFn: async () => await axiosClient.get(`/products/${product_id}`),
    queryKey: ["product-in-upload", product_id],
    enabled: !!product_id,
  });

  const { data, isLoading } = productResponse;

  const apartment = data?.data || ({} as IApartment);

  const { error, isError, isPending, mutate } = useMutation({
    mutationFn: async (values: { [key: string]: any }) => {
      return product_id
        ? await axiosClient.put(`/products/${product_id}`, values)
        : await axiosClient.post(`/products`, values);
    },
    mutationKey: ["create-update-product"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["product-in-upload"] });
    },
    onError: (error: AxiosError<{ error: string }>) =>
      toast.error(error.response?.data?.error),
  });

  const createProduct = ({ data, callback_url }: Options) => {
    mutate(
      { ...data },
      {
        onSuccess: async (response: AxiosResponse<IApartment>) => {
          const product_id = response?.data?._id;
          router.replace(
            `/product-upload${callback_url}?product_id=${product_id}`
          );
        },
      }
    );
  };

  const updateProduct = ({ data, callback_url }: Options) => {
    console.log({ data });
    mutate(
      { ...data },
      {
        onSuccess: async (response: AxiosResponse<IApartment>) => {
          toast.success("Product updated");
          const product = response.data;
          router.replace(
            `/product-upload${callback_url}?product_id=${product._id}`
          );
        },
      }
    );
  };

  const reloadProduct = async () => {
    await queryClient.invalidateQueries({ queryKey: ["product-in-upload"] });
  };

  let loading = isLoading || isPending;

  return (
    <ApartmentUploadContext.Provider
      value={{
        createProduct,
        updateProduct,
        reloadProduct,
        loading,
        apartment,
        error,
        isError,
      }}
    >
      {children}
    </ApartmentUploadContext.Provider>
  );
}

export const useApartmentUpload = () => {
  const context = React.useContext(ApartmentUploadContext);
  if (!context) {
    throw new Error(
      "Product image-uploader context can only be use with its scope"
    );
  } else {
    return context;
  }
};
