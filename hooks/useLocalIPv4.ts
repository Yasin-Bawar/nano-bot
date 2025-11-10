import { useEffect, useState } from "react";

function isPrivateIPv4(ip: string) {
    // matches IPv4 like 192.168.x.x, 10.x.x.x, 172.16-31.x.x
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return false;
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    return false;
}

export function useLocalIPv4(timeoutMs = 3000) {
    const [ip, setIp] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let pc: RTCPeerConnection | null = null;
        let timer: number | null = null;
        const ipsFound = new Set<string>();

        async function start() {
            try {
                // Some examples use STUN servers, but we can leave empty
                pc = new RTCPeerConnection({ iceServers: [] });

                // Create a bogus datachannel to make ICE candidates appear
                pc.createDataChannel("ice-check");

                pc.onicecandidate = (ev) => {
                    if (!ev.candidate) return;
                    const cand = ev.candidate.candidate;

                    // regex to find IPv4 addresses in the candidate string
                    const ipv4Match = cand.match(/(\d{1,3}\.){3}\d{1,3}/g);
                    if (!ipv4Match) return;

                    for (const candidateIp of ipv4Match) {
                        if (!ipsFound.has(candidateIp) && isPrivateIPv4(candidateIp)) {
                            ipsFound.add(candidateIp);
                            setIp(candidateIp);
                            // we can stop early if we got one
                            cleanup();
                            return;
                        }
                    }
                };

                // Fallback when onicecandidate may not fire often: create offer and setLocalDescription
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                // safety timeout
                timer = window.setTimeout(() => {
                    if (!ipsFound.size) {
                        setError("No local IPv4 found (blocked by browser / privacy).");
                    }
                    cleanup();
                }, timeoutMs);
            } catch (err: any) {
                setError(String(err));
                cleanup();
            }
        }

        function cleanup() {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            if (pc) {
                try { pc.close(); } catch { }
                pc = null;
            }
        }

        start();
        return () => {
            cleanup();
        };
    }, [timeoutMs]);

    return { ip, error };
}
