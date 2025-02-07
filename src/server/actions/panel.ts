"use server";

import { revalidatePath } from "next/cache";
import { setData } from "../db";
import { Panel } from "@/types";

export async function updatePanel(panel: Panel) {
  setData({
    panel: {
      ...panel,
      updatedAt: new Date().toJSON(),
    },
  });
  revalidatePath("/panel");
}
