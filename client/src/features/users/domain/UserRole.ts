export const UserRole = {
  ADMIN: 'admin',
  EDITOR: 'editor',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];