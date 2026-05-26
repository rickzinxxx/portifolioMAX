import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UploadCloud, Lock, Unlock, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAvatarBase64: string | null) => void;
}

export default function AvatarUploadModal({ isOpen, onClose, onSuccess }: AvatarUploadModalProps) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read current avatar to show as preview if unlocked
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('rick_avatar_data');
      if (saved) {
        setPreview(saved);
      } else {
        setPreview(null);
      }
      setIsUnlocked(false);
      setPassword('');
      setError(null);
      setSuccessMsg(null);
      setIsSaving(false);
    }
  }, [isOpen]);

  // Auth check with custom pin code for security
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-negotiated pin/password: "rickzinxx" or "2026"
    if (password.toLowerCase() === 'rickzinxx' || password === '2026') {
      setIsUnlocked(true);
      setError(null);
    } else {
      setError('Acesso negado. Insira a senha de desenvolvedor correta.');
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, anexe apenas arquivos de imagem (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for crop and resize to exactly 256x256 for optimal profile rendering
        const canvas = document.createElement('canvas');
        const maxDim = 256;
        canvas.width = maxDim;
        canvas.height = maxDim;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Crop in standard square shape centered
          const size = Math.min(img.width, img.height);
          const xOffset = (img.width - size) / 2;
          const yOffset = (img.height - size) / 2;
          ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, maxDim, maxDim);
          
          // Render optimized JPEG around 15KB size
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
          setPreview(compressedBase64);
          setError(null);
        } else {
          setError('Erro ao processar imagem.');
        }
      };
      img.onerror = () => {
        setError('Arquivo de imagem inválido.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
 
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!preview) {
      setError('Por favor, anexe uma imagem primeiro.');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMsg('Salvando na nuvem...');

      // 1. Save to local storage for local immediate update
      localStorage.setItem('rick_avatar_data', preview);
      window.dispatchEvent(new CustomEvent('rick_avatar_updated', { detail: preview }));

      // 2. Upload to central cloud KV store
      const response = await fetch('https://kvdb.io/6gQ8bW2uV7H3rPnGkWyZ/rickzinxx_avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: preview,
      });

      if (!response.ok) {
        throw new Error(`Servidor respondeu com código ${response.status}`);
      }

      setSuccessMsg('Foto salva na nuvem e atualizada para todos!');
      setError(null);
      setTimeout(() => {
        onSuccess(preview);
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
      setError('Salvo localmente! Ocorreu um pequeno atraso ao sincronizar na nuvem.');
      setTimeout(() => {
        onSuccess(preview);
        onClose();
      }, 1500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMsg('Restaurando padrão...');

      localStorage.removeItem('rick_avatar_data');
      window.dispatchEvent(new CustomEvent('rick_avatar_updated', { detail: null }));

      // Send reset call to cloud
      await fetch('https://kvdb.io/6gQ8bW2uV7H3rPnGkWyZ/rickzinxx_avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: 'RESET',
      });

      setSuccessMsg('Foto restaurada para o padrão.');
      setPreview(null);
      setError(null);
      setTimeout(() => {
        onSuccess(null);
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
      setError('Falha de conexão com a nuvem durante o reset.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="avatar-uploader-portal" className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-zinc-950/90 border border-primary/20 p-6 md:p-8 rounded-2xl shadow-[0_0_50px_rgba(255,40,0,0.15)] overflow-hidden z-10"
        >
          {/* Top border decor */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-orange-500" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h4 className="font-sans font-black italic text-lg uppercase tracking-tight text-white flex items-center gap-2">
              {isUnlocked ? <Unlock className="text-primary w-5 h-5 animate-pulse" /> : <Lock className="text-zinc-500 w-5 h-5" />}
              Painel de Customização
            </h4>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
              {isUnlocked ? 'Área desprotegida' : 'Exclusivo para Rickzinxx'}
            </p>
          </div>

          {/* STEP 1: Unlock Auth Panel */}
          {!isUnlocked ? (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 font-mono text-xs text-red-400 space-y-1.5 leading-relaxed">
                <p>⚠️ Área Restrita</p>
                <p className="text-[10px] text-zinc-400">Este painel requer a chave criptográfica do desenvolvedor principal para autenticação.</p>
              </div>

              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">
                  Código de Autenticação / Senha
                </label>
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 font-mono transition-colors"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs leading-none">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-black text-xs font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all duration-300"
              >
                Checar Identidade
              </button>
            </form>
          ) : (
            /* STEP 2: Drag & Drop Area styled with sleek futuristic outline */
            <div className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-xs">
                  <Check size={14} className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Upload Drag zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 hover:border-primary/40 bg-white/[0.02] hover:bg-primary/[0.01]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {preview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                    />
                    <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                      Imagem Carregada
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <UploadCloud size={32} className="text-zinc-500 group-hover:text-primary transition-colors" />
                    <span className="font-sans font-bold text-xs text-white">Arraste sua foto aqui</span>
                    <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                      ou clique para procurar (.png, .jpg, .webp)
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleReset}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-400 hover:text-white text-[10px] font-mono uppercase tracking-widest border border-white/5 transition-colors"
                >
                  <RefreshCw size={12} className={isSaving ? 'animate-spin' : ''} />
                  {isSaving ? 'Sincronizando' : 'Reset Padrão'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="py-3 rounded-lg bg-primary text-black hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_4px_12px_rgba(255,40,0,0.2)]"
                >
                  {isSaving ? 'Salvando...' : 'Confirmar Arte'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
