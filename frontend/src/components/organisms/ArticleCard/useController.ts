import { useNavigate } from "react-router-dom";
import { Article } from "../../../types/article";

export const useController = (article: Article) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/articles/${article.id}`);
  };

  return {
    handleCardClick,
  };
};
