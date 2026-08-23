"use client";

import { useEffect, useMemo, useState } from "react";
import { localDeviceApi, remoteDeviceApi } from "@/client/deviceApi";
import { DeviceState } from "../types";
import DeviceScreen from "./DeviceScreen";
import { usePeers } from "./usePeers";

interface MainScreenProps {
  initialState: DeviceState;
}

export default function MainScreen({ initialState }: MainScreenProps) {
  const localApi = useMemo(() => localDeviceApi(), []);
  const peers = usePeers(localApi);

  const localDeviceId = initialState.deviceId;
  const [selectedDeviceId, setSelectedDeviceId] = useState(localDeviceId);
  const [localName, setLocalName] = useState(initialState.panel.name);

  const selectedPeer =
    peers.find((peer) => peer.id === selectedDeviceId) ?? null;
  const isLocal = selectedDeviceId === localDeviceId;

  useEffect(() => {
    if (!isLocal && !selectedPeer) setSelectedDeviceId(localDeviceId);
  }, [isLocal, selectedPeer, localDeviceId]);

  const api = useMemo(
    () => (selectedPeer ? remoteDeviceApi(selectedPeer) : localApi),
    [selectedPeer, localApi],
  );

  return (
    <DeviceScreen
      key={selectedDeviceId}
      api={api}
      initialState={isLocal ? initialState : null}
      localName={localName}
      localDeviceId={localDeviceId}
      selectedDeviceId={selectedDeviceId}
      peers={peers}
      onSelectDevice={setSelectedDeviceId}
      onLocalNameChange={setLocalName}
    />
  );
}
