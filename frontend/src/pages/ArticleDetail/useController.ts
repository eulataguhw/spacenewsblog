import { useNavigate, useParams } from "react-router-dom";
import { useModel } from "./useModel";

export const useController = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { article, comments, isLoading, isCommentsLoading, isError } =
    useModel();

  const handleBackClick = () => {
    navigate("/");
  };

  return {
    id,
    article,
    comments,
    isLoading,
    isCommentsLoading,
    isError,
    handleBackClick,
  };
};
