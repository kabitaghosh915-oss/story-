import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Code2, Download, FileCode } from 'lucide-react';

interface SourceCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

const FILES = [
  {
    name: 'index.html',
    desc: 'মূল এইচটিএমএল কঙ্কাল ও লেআউট',
    url: '/vanilla/index.html',
  },
  {
    name: 'style.css',
    desc: 'আধুনিক ডিজাইন, ডার্ক থিম ও রেসপনসিভনেস',
    url: '/vanilla/style.css',
  },
  {
    name: 'js/storage.js',
    desc: 'লোকাল স্টোরেজ ডেটাবেজ কন্ট্রোলার',
    url: '/vanilla/js/storage.js',
  },
  {
    name: 'js/library.js',
    desc: 'লাইব্রেরি ও গল্প রেন্ডারিং লজিক',
    url: '/vanilla/js/library.js',
  },
  {
    name: 'js/writer.js',
    desc: 'গল্প লেখা, সম্পাদনা ও কাউন্টার লজিক',
    url: '/vanilla/js/writer.js',
  },
  {
    name: 'js/profile.js',
    desc: 'লেখক প্রোফাইল ও বুকমার্ক সেকশন',
    url: '/vanilla/js/profile.js',
  },
  {
    name: 'js/app.js',
    desc: 'ট্যাব রাউটিং ও মূল অ্যাপ্লিকেশন কন্ট্রোলার',
    url: '/vanilla/js/app.js',
  },
];

export const SourceCodeModal: React.FC<SourceCodeModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [selectedFile, setSelectedFile] = useState(FILES[0]);
  const [fileContent, setFileContent] = useState<string>('লোড হচ্ছে...');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    fetch(selectedFile.url)
      .then((res) => res.text())
      .then((data) => {
        setFileContent(data);
        setIsLoading(false);
      })
      .catch(() => {
        setFileContent('ফাইল লোড করতে সমস্যা হয়েছে।');
        setIsLoading(false);
      });
  }, [selectedFile, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setIsCopied(true);
    onShowToast(`"${selectedFile.name}" ফাইলের কোড কপি হয়েছে!`, 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name.split('/').pop() || selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`"${selectedFile.name}" ডাউনলোড হয়েছে!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                প্রজেক্ট সোর্স কোড ও ফাইলসমূহ
              </h3>
              <p className="text-xs text-slate-500">
                কম্পিউটারে সরাসরি রান করার জন্য সবকটি ফাইল তৈরি করা হয়েছে
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/vanilla/index.html"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 transition-colors"
            >
              <span>নতুন ট্যাবে রান করুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* File sidebar selector */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-3 space-y-1 bg-slate-50/50 dark:bg-slate-950/50 overflow-y-auto shrink-0 max-h-40 md:max-h-none">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1">
              প্রজেক্ট ফাইল তালিকা
            </div>
            {FILES.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-all ${
                  selectedFile.name === file.name
                    ? 'bg-purple-600 text-white font-medium shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-900 text-slate-200">
            {/* File info bar */}
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-mono text-purple-400 font-semibold">
                  {selectedFile.name}
                </span>
                <span className="hidden sm:inline">· {selectedFile.desc}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 inline-flex items-center gap-1 transition-colors text-[11px]"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>কোড কপি করুন</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white inline-flex items-center gap-1 transition-colors text-[11px]"
                  title="ফাইলটি ডাউনলোড করুন"
                >
                  <Download className="w-3 h-3" />
                  <span>ডাউনলোড</span>
                </button>
              </div>
            </div>

            {/* Code Pre container */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300">
              {isLoading ? (
                <div className="py-10 text-center text-slate-500">লোড হচ্ছে...</div>
              ) : (
                <pre className="whitespace-pre">{fileContent}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
