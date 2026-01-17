import { useParams } from "react-router-dom";

export const useModel = () => {
  const { id } = useParams();

  // Future: Fetch article details here using id

  return {
    id,
  };
};
