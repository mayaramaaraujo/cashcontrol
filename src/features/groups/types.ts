import * as z from "zod";

export type Group = {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  createdAt: string;
};

export type GroupMember = {
  id: string;
  groupId: string;
  userId: string | null;
  invitedEmail: string | null;
  displayName: string;
  role: "admin" | "member";
  colorIndex: number;
  status: "active" | "invited";
  createdAt: string;
};

export const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
});

export type CreateGroupValues = z.infer<typeof createGroupSchema>;
