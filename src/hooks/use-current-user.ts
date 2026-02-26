import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth-store";
import { decodeJwt } from "../utils/decode-jwt";
import { getUser } from "../services/user-service";
import type { UserResponseDto } from "../types";

/**
 * Returns the current user's profile via GET /users/:id.
 * The user id is decoded from the JWT token stored in the auth store.
 * Data is cached by React Query — no extra requests while the cache is fresh.
 */
export const useCurrentUser = (): UserResponseDto | undefined => {
  const token = useAuthStore((s) => s.token);
  const userId = token ? decodeJwt(token).id : null;

  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return data;
};
