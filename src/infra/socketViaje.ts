// infra/socketViaje.ts
import { io, Socket } from "socket.io-client";

const URL = "https://backend-tesis-jvfm.onrender.com"; // <- ajusta si necesitas http:// o wss://

let socket: Socket | null = null;

export const connectSocketToViaje = (viajeId: string) => {
  console.log("[infra] connectSocketToViaje called, viajeId:", viajeId);

  if (!viajeId) {
    console.warn("[infra] No viajeId proporcionado — abortando conexión");
    return null;
  }

  // si ya hay socket y conectado, evita recrearlo
  if (socket && socket.connected) {
    console.log("[infra] Socket ya conectado, reusando. id:", socket.id);
    // aseguramos que esté unido a la sala en caso de reconexión previa
    try { socket.emit("join_viaje", viajeId); console.log("[infra] Emit join_viaje (reuse)"); } catch(e){console.warn(e)}
    return socket;
  }

  // crear socket nuevo
  socket = io(URL, {
    transports: ["websocket", "polling"],
    path: "/socket.io",
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    timeout: 10000, // ms
  });

  socket.on("connect", () => {
    console.log("[infra] 🟢 Socket connected:", socket?.id);
    socket?.emit("join_viaje", viajeId);
    console.log("[infra] 📡 Emitted join_viaje:", viajeId);
  });

  socket.on("disconnect", (reason) => {
    console.log("[infra] 🔴 Socket disconnected:", reason);
  });

  socket.on("connect_error", (err: any) => {
    console.error("[infra] ❌ connect_error:", err && err.message ? err.message : err);
  });

  socket.on("reconnect_attempt", (n) => {
    console.log("[infra] 🔁 reconnect_attempt:", n);
  });

  socket.on("reconnect_failed", () => {
    console.error("[infra] ❌ reconnect_failed");
  });

  socket.on("error", (err) => {
    console.error("[infra] socket error:", err);
  });

  // handler genérico para debugging
  socket.onAny((event, ...args) => {
    console.log(`[infra] event <- ${event}`, args);
  });

  try {
    console.log("[infra] Llamando socket.connect()");
    socket.connect();
  } catch (e) {
    console.error("[infra] Error al socket.connect()", e);
  }

  return socket;
};

export const onCoordenada = (cb: (d: any) => void) => {
  if (!socket) {
    console.warn("[infra] onCoordenada: socket null");
    return;
  }
  socket.on("coordenada", cb);
};

export const offCoordenada = (cb: (d: any) => void) => {
  socket?.off("coordenada", cb);
};

export const disconnectSocket = () => {
  if (!socket) { console.log("[infra] disconnectSocket: no socket"); return; }
  try {
    socket.disconnect();
    console.log("[infra] disconnectSocket: desconectado y limpiado");
  } catch (e) {
    console.warn("[infra] disconnectSocket error:", e);
  }
  socket = null;
};

export const getSocket = () => socket;
