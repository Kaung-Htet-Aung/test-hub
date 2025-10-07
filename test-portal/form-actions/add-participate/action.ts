"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .nonempty("Phone number is required")
    .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number"),
  note: z.string(),
  groupId: z.string().trim().nonempty(),
});

type ParticipantInput = z.infer<typeof schema>;
type ParticipantErrors = Partial<Record<keyof ParticipantInput, string[]>>;

export async function createParticipant(
  prevState: { success: boolean; message: string | object; errors?: any },
  formData: FormData
) {
  // Extract values from browser FormData
  const parse = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    note: formData.get("note"),
    groupId: formData.get("group"),
  });

  if (!parse.success) {
    const errors: ParticipantErrors = z.flattenError(parse.error).fieldErrors;
    return {
      success: false,
      message: "Validation Failed !",
      errors,
    };
  }

  const data = parse.data;
  console.log("formdata", data);
  try {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        note: data.note,
        groupMembers: {
          create: {
            group: {
              connect: { id: data.groupId }, // existing group
            },
          },
        },
      },
    });

    revalidatePath("/participants");
    return { success: true, message: `Added participant ${data.name}` };
  } catch (err) {
    return { success: false, message: "Participant Already Exit!" };
  }
}
