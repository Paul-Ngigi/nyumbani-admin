import React from "react";
import { Button } from "../ui/button";

interface PaginationProps {
  skip: number;
  limit: number;
  dataLoading: boolean;
  dataLength: number;
  onPageChange: (newSkip: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  skip,
  limit,
  dataLoading,
  dataLength,
  onPageChange,
}) => {
  const goToPrevPage = () => {
    let newSkip = skip - limit;
    if (newSkip < 0) {
      newSkip = 0;
    }
    onPageChange(newSkip);
  };

  const goToNextPage = () => {
    const newSkip = skip + limit;
    onPageChange(newSkip);
  };

  return (
    <div className="flex gap-3">
      {!dataLoading && (
        <Button
          variant={"outline"}
          onClick={goToPrevPage}
          disabled={skip === 0}
        >
          Previous
        </Button>
      )}

      {!dataLoading && dataLength === limit && (
        <Button
          variant={"outline"}
          onClick={goToNextPage}          
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default PaginationComponent;
