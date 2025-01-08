import App from "../../components/App";
import { Settings } from "@/components/Settings";
import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { panel } = await getData();
  return (
    <App>
      <Settings panel={panel} />
    </App>
  );
}
