import App from "../../components/App";
import { Settings } from "@/components/Settings";
import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { panel, nextVersion } = await getData();

  return (
    <App nextVersion={nextVersion}>
      <Settings panel={panel} />
    </App>
  );
}
