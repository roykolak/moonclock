import { spawn } from "child_process";

export const dynamic = "force-dynamic";

const UNITS = [
  "moonclock-app",
  "moonclock-hardware",
  "moonclock-update-checker.timer",
];

export async function GET(req: Request) {
  const args = [
    "-f",
    "-n",
    "200",
    "-o",
    "json",
    ...UNITS.flatMap((unit) => ["-u", unit]),
  ];

  const proc = spawn("journalctl", args);

  const stream = new ReadableStream({
    start(controller) {
      let buffer = "";
      let closed = false;

      const cleanup = () => {
        if (closed) return;
        closed = true;
        try {
          proc.kill("SIGTERM");
        } catch {}
        try {
          controller.close();
        } catch {}
      };

      proc.stdout.on("data", (chunk: Buffer) => {
        if (closed) return;
        buffer += chunk.toString("utf8");
        let nl: number;
        while ((nl = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.trim()) {
            try {
              controller.enqueue(`data: ${line}\n\n`);
            } catch {
              cleanup();
              return;
            }
          }
        }
      });

      proc.on("error", (err) => {
        try {
          controller.enqueue(
            `event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`,
          );
        } catch {}
        cleanup();
      });

      proc.on("close", () => cleanup());

      req.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
