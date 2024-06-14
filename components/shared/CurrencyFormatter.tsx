import React from "react";

interface CurrencyFormatterProps {
  value: number;
}

const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({ value }) => {  
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);  
  return <span>{formattedValue}</span>;
};

export default CurrencyFormatter;
