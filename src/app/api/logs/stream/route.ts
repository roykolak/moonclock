import { spawn } from "child_process";

export const dynamic = "force-dynamic";

const UNITS = [
  "moonclock-app.service",
  "moonclock-hardware.service",
  "moonclock-update-checker.timer",
  "moonclock-update-checker.service",
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

      // Close the stream when the app service is stopped or restarted. Next's
      // production graceful shutdown runs server.close(), which waits for open
      // connections to drain (it does not force-close them outside dev). This
      // `journalctl -f` follow never ends on its own, so without this it holds
      // the whole server open — ~12s per update while systemd waits to stop it.
      const onShutdown = () => cleanup();

      const cleanup = () => {
        if (closed) return;
        closed = true;
        process.removeListener("SIGTERM", onShutdown);
        process.removeListener("SIGINT", onShutdown);
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
      process.once("SIGTERM", onShutdown);
      process.once("SIGINT", onShutdown);
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
