import moment from "moment";
import { FC } from "react";

interface useMomentProps {
  timestamp?: number;
  format?: "DATE" | "DATETIME";
}

const UseMoment: FC<useMomentProps> = ({ timestamp, format }) => {
  switch (format) {
    case "DATE":
      return moment(timestamp).format("LL");
    case "DATETIME":
      return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    default:
      break;
  }
};

export default UseMoment;
