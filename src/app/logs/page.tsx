import App from "../../components/App";
import { LogsViewer } from "@/components/LogsViewer";
import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { nextVersion } = await getData();

  return (
    <App nextVersion={nextVersion}>
      <LogsViewer />
    </App>
  );
}
