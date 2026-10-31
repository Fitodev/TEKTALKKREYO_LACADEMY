export function classifySupabaseKey(
  value: unknown,
): "missing" | "privileged" | "public" | "invalid";
export function findSecretKinds(text: string): string[];
