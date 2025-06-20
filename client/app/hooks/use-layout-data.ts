import { useMatches } from "react-router";

export interface UserLayoutData {
  success: boolean;
  message: string;
  data: {
    public_id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function useLayoutData(): UserLayoutData {
  const matches = useMatches();
  const layoutMatch = matches.find((match) => match.id === "routes/layout") as {
    data: UserLayoutData;
  };
  return layoutMatch?.data;
}
