"use client";

import { Modal } from "@mantine/core";
import { useRouter } from "next/navigation";

interface PanelProps {
  title: string;
  children: React.ReactNode;
}

export default function ModalWrapper({ children, title }: PanelProps) {
  const router = useRouter();
  return (
    <Modal opened={true} onClose={router.back} title={title}>
      {children}
    </Modal>
  );
}
