import { useNavigate } from "react-router-dom";
import { useModel } from "./useModel";

export const useController = () => {
  const navigate = useNavigate();
  const { id } = useModel();

  const handleBackClick = () => {
    navigate("/");
  };

  return {
    id,
    handleBackClick,
  };
};
