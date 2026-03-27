"use client";

import React, { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2, Terminal as TerminalIcon, X } from "lucide-react";

interface CommandRecord {
  cmd: string;
  output: React.ReactNode;
}

const INITIAL_MESSAGE = `
TJKT Network Simulator (v1.0.0)
Type 'help' for a list of available commands.

root@tjkt-server:~# `;

export function TerminalSimulator() {
  const [history, setHistory] = useState<CommandRecord[]>([]);
  const [inputStr, setInputStr] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, inputStr]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputStr.trim().toLowerCase();
    
    if (!cmd) return;

    let output: React.ReactNode = "";

    switch (cmd) {
      case "help":
        output = (
          <div className="text-emerald-400">
            Available commands:
            <br />
            &nbsp;&nbsp;ping &lt;host&gt;&nbsp;&nbsp;&nbsp;&nbsp; - Send ICMP ECHO_REQUEST to network hosts
            <br />
            &nbsp;&nbsp;ipconfig &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Show network interfaces
            <br />
            &nbsp;&nbsp;tracert &lt;host&gt;&nbsp; - Trace route to a destination
            <br />
            &nbsp;&nbsp;netstat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Print network connections
            <br />
            &nbsp;&nbsp;clear &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the terminal screen
          </div>
        );
        break;
      case "clear":
        setHistory([]);
        setInputStr("");
        return;
      case "ipconfig":
        output = (
          <div className="text-gray-300">
            eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inet6 fe80::215:5dff:fe00:108  prefixlen 64  scopeid 0x20&lt;link&gt;
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ether 00:15:5d:00:01:08  txqueuelen 1000  (Ethernet)
            <br /><br />
            lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inet 127.0.0.1  netmask 255.0.0.0
          </div>
        );
        break;
      case "netstat":
        output = (
          <div className="text-gray-300">
            Active Internet connections (w/o servers)
            <br />
            Proto Recv-Q Send-Q Local Address           Foreign Address         State
            <br />
            tcp        0      0 192.168.1.10:443      10.0.0.5:54321          ESTABLISHED
            <br />
            tcp        0      0 192.168.1.10:22       192.168.1.50:60021      ESTABLISHED
          </div>
        );
        break;
      default:
        if (cmd.startsWith("ping ")) {
          const host = cmd.split(" ")[1] || "localhost";
          output = (
            <div className="text-gray-300">
              PING {host} (142.250.190.46) 56(84) bytes of data.
              <br />
              64 bytes from {host}: icmp_seq=1 ttl=115 time=24.5 ms
              <br />
              64 bytes from {host}: icmp_seq=2 ttl=115 time=23.1 ms
              <br />
              64 bytes from {host}: icmp_seq=3 ttl=115 time=25.0 ms
              <br />
              64 bytes from {host}: icmp_seq=4 ttl=115 time=22.8 ms
              <br />
              <br />
              --- {host} ping statistics ---
              <br />
              4 packets transmitted, 4 received, 0% packet loss, time 3004ms
              <br />
              rtt min/avg/max/mdev = 22.8/23.85/25.0/0.92 ms
            </div>
          );
        } else if (cmd.startsWith("tracert ")) {
            const host = cmd.split(" ")[1] || "localhost";
            output = (
              <div className="text-gray-300">
                Tracking route to {host} over a maximum of 30 hops:
                <br /><br />
                &nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&lt;1 ms&nbsp;&nbsp;&nbsp;&nbsp;&lt;1 ms&nbsp;&nbsp;&nbsp;&nbsp;&lt;1 ms&nbsp;&nbsp;192.168.1.1
                <br />
                &nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;12 ms&nbsp;&nbsp;&nbsp;&nbsp;11 ms&nbsp;&nbsp;&nbsp;&nbsp;10 ms&nbsp;&nbsp;10.20.30.1
                <br />
                &nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;&nbsp;15 ms&nbsp;&nbsp;&nbsp;&nbsp;14 ms&nbsp;&nbsp;&nbsp;&nbsp;15 ms&nbsp;&nbsp;203.0.113.1
                <br />
                &nbsp;&nbsp;4&nbsp;&nbsp;&nbsp;&nbsp;24 ms&nbsp;&nbsp;&nbsp;&nbsp;23 ms&nbsp;&nbsp;&nbsp;&nbsp;22 ms&nbsp;&nbsp;{host}
                <br /><br />
                Trace complete.
              </div>
            );
        } else {
          output = (
            <div className="text-red-400">
              bash: {cmd}: command not found
            </div>
          );
        }
    }

    setHistory([...history, { cmd: inputStr, output }]);
    setInputStr("");
  };

  return (
    <div className={`flex flex-col rounded-xl overflow-hidden border shadow-2xl transition-all duration-300 ${isMaximized ? 'fixed inset-4 z-50 bg-black/95 backdrop-blur-3xl' : 'w-full h-[500px] bg-zinc-950'}`}>
      {/* Terminal Header */}
      <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0 cursor-default select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-medium text-zinc-400 font-mono tracking-wider">root@tjkt-server:~</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMaximized(!isMaximized)}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-sm leading-relaxed text-emerald-400 selection:bg-emerald-500/30 font-medium"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="whitespace-pre-wrap text-emerald-300/80 mb-6 drop-shadow-sm">
          {INITIAL_MESSAGE}
        </div>

        {history.map((record, i) => (
          <div key={i} className="mb-4">
            <div className="flex gap-2 text-emerald-300">
              <span className="text-emerald-500 font-bold">root@tjkt-server:~#</span> 
              <span className="text-zinc-100">{record.cmd}</span>
            </div>
            <div className="mt-1">{record.output}</div>
          </div>
        ))}

        <form onSubmit={handleCommand} className="flex gap-2">
          <span className="text-emerald-500 font-bold shrink-0">root@tjkt-server:~#</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-transparent focus:ring-0 p-0 shadow-none font-mono"
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />
        </form>
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
