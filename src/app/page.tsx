import "@mantine/core/styles.css";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/panel");
}
