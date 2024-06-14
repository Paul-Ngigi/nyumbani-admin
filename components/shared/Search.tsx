import { processHttpErrors } from "@/actions/ProcessHttpErrors";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CiSearch } from "react-icons/ci";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

interface SearchProps {
  searchParams: any;
  onSearchResults: (results: any) => void;
  onInputEmpty: (isEmpty: boolean) => void;
}

const Search: React.FC<SearchProps> = ({
  searchParams,
  onSearchResults,
  onInputEmpty,
}) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      inputItem: "",
    },
  });

  const initiateSearch = async (data: any) => {
    let url = searchParams.url;
    return await axiosClient.post(url, data);
  };

  const [isSearching, setIsSearching] = useState(false);
  const searchQuery = {};

  const search = async (data: { inputItem: string }) => {
    setIsSearching(true);
    let cleanInputItem: any = data.inputItem;

    if (data.inputItem === "true") {
      cleanInputItem = true;
    }

    if (data.inputItem === "false") {
      cleanInputItem = false;
    }

    if (!data.inputItem) {
      setIsSearching(false);
      toast({
        variant: "warning",
        title: "No search item!",
        description: "Please enter your search item!",
      });
      return;
    }

    const fields = searchParams.searchFields.map((item: any) => ({
      [item]: { $regex: cleanInputItem, $options: "i" },
    }));

    let finalQuery = {};
    if (searchParams.customQuery.$or) {
      const andQuery = {
        $and: [{ $or: fields }, { $or: searchParams.customQuery.$or }],
      };

      delete searchParams.customQuery.$or;
      finalQuery = { ...andQuery, ...searchParams.customQuery };
    } else {
      finalQuery = { $or: fields, ...searchParams.customQuery };
    }

    if (finalQuery) {
      mutation.mutate(finalQuery);
    }
  };

  const mutation: any = useMutation({
    mutationKey: ["search"],
    mutationFn: (values) => initiateSearch(values),
    onMutate: () => {
      setIsSearching(true);
    },
    onSuccess: (data) => {
      setIsSearching(false);
      const res = data.data;

      if (res.Status === 200) {
        onSearchResults(res.Payload);
      } else {
        toast({
          variant: "warning",
          title: res.Message,
          description: res.Payload,
        });
      }
    },
    onError: (err: any) => {
      setIsSearching(false);
      toast({
        variant: "destructive",
        title: "Ooops! Something went wrong",
        description: processHttpErrors(err),
      });
    },
  });

  const inputItem = watch("inputItem");
  React.useEffect(() => {
    if (!inputItem) {
      onInputEmpty(true);
    }
  }, [inputItem, onInputEmpty]);

  return (
    <div>
      <form onSubmit={handleSubmit(search)}>
        <div className="flex items-center gap-2 border rounded ">
          <Controller
            name="inputItem"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Search..."
                className="border-none  py-2 px-3"
              />
            )}
          />
          <Button
            className="border-none"
            variant="outline"
            type="submit"
            disabled={isSearching}
          >
            {isSearching ? "..." : <CiSearch />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Search;
