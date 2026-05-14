import React, { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, Eye, EyeOff, QrCode } from "lucide-react";

export default function LoginQRGenerator() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [includeUsername, setIncludeUsername] = useState(true);
  const [includeTab, setIncludeTab] = useState(true);
  const [includePassword, setIncludePassword] = useState(true);
  const [includeEnter, setIncludeEnter] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const qrPayload = useMemo(() => {
    let value = "";
    if (includeUsername) value += username;
    if (includeTab) value += "\t";
    if (includePassword) value += password;
    if (includeEnter) value += "\n";
    return value;
  }, [username, password, includeUsername, includeTab, includePassword, includeEnter]);

  const visiblePayload = qrPayload
    .replaceAll("\t", "[TAB]")
    .replaceAll("\n", "[ENTER]");

  useEffect(() => {
    let isMounted = true;

    async function generateQr() {
      if (!qrPayload) {
        setQrDataUrl("");
        return;
      }

      try {
        const url = await QRCode.toDataURL(qrPayload, {
          errorCorrectionLevel: "H",
          margin: 2,
          width: 320,
        });
        if (isMounted) setQrDataUrl(url);
      } catch (error) {
        console.error("QR generation failed:", error);
        if (isMounted) setQrDataUrl("");
      }
    }

    generateQr();
    return () => {
      isMounted = false;
    };
  }, [qrPayload]);

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(qrPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const downloadPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "login-qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <section className="bg-white/10 border border-white/15 text-white shadow-2xl rounded-2xl">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/15 border border-cyan-300/30 px-3 py-1 text-sm text-cyan-100">
                <QrCode size={16} /> Login QR Generator
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Generate a login QR code</h1>
              <p className="text-slate-300">Builds a QR payload in this order: username, tab, password, enter.</p>
            </div>

            <div className="grid gap-5">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-slate-200">Username</label>
                <input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-xl bg-slate-900/70 border border-white/15 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">Password</label>
                <div className="flex gap-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl bg-slate-900/70 border border-white/15 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-slate-900/60 p-4 space-y-3">
              <h2 className="font-semibold text-lg">QR sequence options</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Option checked={includeUsername} onChange={setIncludeUsername} label="Username" />
                <Option checked={includeTab} onChange={setIncludeTab} label="Tab" />
                <Option checked={includePassword} onChange={setIncludePassword} label="Password" />
                <Option checked={includeEnter} onChange={setIncludeEnter} label="Enter" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Preview</h2>
              <div className="min-h-14 rounded-xl bg-black/35 border border-white/10 p-4 font-mono text-sm break-all text-slate-100">
                {visiblePayload || "Your QR sequence will appear here."}
              </div>
              <textarea
                readOnly
                value={qrPayload}
                aria-label="Raw QR payload"
                className="w-full min-h-24 rounded-xl bg-black/35 border border-white/10 p-4 font-mono text-sm text-slate-100 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyPayload}
                disabled={!qrPayload}
                className="inline-flex items-center rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold px-4 py-3"
              >
                <Copy size={18} className="mr-2" /> {copied ? "Copied" : "Copy payload"}
              </button>
              <button
                type="button"
                onClick={downloadPng}
                disabled={!qrDataUrl}
                className="inline-flex items-center rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white border border-white/15 px-4 py-3"
              >
                <Download size={18} className="mr-2" /> Download PNG
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center h-full gap-5">
            <div className="rounded-2xl border border-slate-200 p-5 bg-white">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Generated login QR code" className="w-[280px] h-[280px]" />
              ) : (
                <div className="w-[280px] h-[280px] rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center text-center p-8">
                  Enter login details to generate your QR code.
                </div>
              )}
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-slate-950 text-xl font-bold">Scan-ready QR</h2>
              <p className="text-slate-600 text-sm max-w-sm">
                The QR stores plain text with tab and enter characters. Use only with systems/scanners that treat QR text as keyboard input.
              </p>
              <p className="text-xs text-red-600 max-w-sm">
                Security note: this QR contains the password in readable form. Do not share or leave it posted publicly.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Option({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/10 transition">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-cyan-400"
      />
      <span className="text-sm text-slate-100">{label}</span>
    </label>
  );
}
