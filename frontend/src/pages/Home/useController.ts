import { useAppStore } from "@store/useAppStore";

export const useController = () => {
  const { setSearchQuery } = useAppStore();

  return {
    setSearchQuery,
  };
};
