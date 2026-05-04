import App from "../../components/App";
import { HardwarePage } from "@/components/HardwarePage";
import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { nextVersion } = await getData();

  return (
    <App nextVersion={nextVersion}>
      <HardwarePage />
    </App>
  );
}
