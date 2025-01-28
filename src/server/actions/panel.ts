"use server";

import { revalidatePath } from "next/cache";
import { setData } from "../db";

export async function updatePanel(formData: FormData) {
  setData({
    panel: {
      name: formData.get("name") as any,
    },
  });
  revalidatePath("/panel");
}
