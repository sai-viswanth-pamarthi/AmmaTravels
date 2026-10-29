'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FileCheck2,
  Shield,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  RotateCcw,
  Clock,
  User,
} from 'lucide-react';
import { store } from '@/lib/store';
import { CustomerDocument, DocumentStatus } from '@/lib/types';
import { DocumentStatusBadge } from '@/components/StatusBadge';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<CustomerDocument | null>(null);

  // Correction Modal
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionNotes, setCorrectionNotes] = useState('');

  const refreshDocuments = () => {
    const list = store.getAllDocuments();
    setDocuments(list);
    if (selectedDoc) {
      const updated = list.find((d) => d.id === selectedDoc.id);
      if (updated) setSelectedDoc(updated);
    }
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  const handleUpdateStatus = (docId: string, status: DocumentStatus, notes?: string) => {
    store.updateDocumentStatus(docId, status, notes, 'admin-operator');
    setCorrectionModalOpen(false);
    setCorrectionNotes('');
    refreshDocuments();
  };

  const filteredDocs = statusFilter === 'all'
    ? documents
    : documents.filter((d) => d.status === statusFilter);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
          Compliance & KYC
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Customer Document Verification Desk
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review uploaded Driving Licenses and Identity proofs before vehicle release to adhere to Andhra Pradesh transport guidelines.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All Documents' },
          { key: 'pending', label: 'Pending Review' },
          { key: 'verified', label: 'Verified' },
          { key: 'correction_required', label: 'Correction Required' },
          { key: 'rejected', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === tab.key
                ? 'bg-gold-500 text-navy-950 font-bold'
                : 'bg-navy-900 text-slate-300 hover:bg-navy-850'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid: List Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Document list (6 cols) */}
        <div className="lg:col-span-6 bg-navy-900 border border-navy-800 rounded-3xl p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            Uploaded Files ({filteredDocs.length})
          </h3>

          {filteredDocs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No customer documents found matching filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-navy-850 border-gold-500 shadow-lg'
                        : 'bg-navy-950/70 border-navy-800 hover:border-navy-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-center text-gold-400 shrink-0">
                          <FileCheck2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white capitalize">
                            {doc.documentType.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-slate-300 truncate max-w-xs">{doc.fileName}</p>
                          <p className="text-[10px] text-slate-400">
                            Size: {(doc.fileSizeBytes / 1024).toFixed(0)} KB • User: {doc.userId}
                          </p>
                        </div>
                      </div>
                      <DocumentStatusBadge status={doc.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Document Preview & Actions (6 cols) */}
        <div className="lg:col-span-6 bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
          {selectedDoc ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-2 pb-4 border-b border-navy-800">
                <div>
                  <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest font-mono">
                    Document ID: {selectedDoc.id}
                  </span>
                  <h3 className="text-lg font-black text-white capitalize mt-0.5">
                    {selectedDoc.documentType.replace('_', ' ')}
                  </h3>
                  <p className="text-xs text-slate-400">Uploaded {new Date(selectedDoc.uploadedAt).toLocaleString('en-IN')}</p>
                </div>
                <DocumentStatusBadge status={selectedDoc.status} />
              </div>

              {/* Secure Preview Box */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Protected Document View</span>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-navy-950 border border-navy-800 flex items-center justify-center">
                  {selectedDoc.filePreviewUrl ? (
                    <Image
                      src={selectedDoc.filePreviewUrl}
                      alt={selectedDoc.fileName}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-400 text-xs space-y-2">
                      <FileCheck2 className="w-12 h-12 mx-auto text-gold-400/40" />
                      <p className="font-medium text-white">{selectedDoc.fileName}</p>
                      <p className="text-[10px]">Encrypted Private Vault Path: {selectedDoc.storagePath}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Correction feedback note if present */}
              {selectedDoc.correctionNotes && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                  <strong>Correction Reason:</strong> {selectedDoc.correctionNotes}
                </div>
              )}

              {/* Staff Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-navy-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Verification Decision
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedDoc.id, 'verified')}
                    className="py-2.5 px-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 shadow-lg"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>

                  <button
                    onClick={() => {
                      setCorrectionNotes('');
                      setCorrectionModalOpen(true);
                    }}
                    className="py-2.5 px-2 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-navy-950 flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Need Fix</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedDoc.id, 'rejected', 'Document does not meet transport requirements')}
                    className="py-2.5 px-2 rounded-xl font-bold text-xs bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-900 flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select a customer document from the list to review and verify.
            </div>
          )}
        </div>
      </div>

      {/* Correction Modal */}
      {correctionModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white text-amber-400">
              Request Document Correction
            </h3>
            <p className="text-xs text-slate-300">
              Specify what needs correction (e.g. blurry image, expiry date obscured, backside missing). The customer will be prompted to re-upload.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold">Correction Reason</label>
              <textarea
                rows={3}
                required
                value={correctionNotes}
                onChange={(e) => setCorrectionNotes(e.target.value)}
                placeholder="E.g. The driving license photo is blurry; please upload a clear, legible picture."
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="flex gap-3 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setCorrectionModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl font-semibold bg-navy-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedDoc.id, 'correction_required', correctionNotes)}
                disabled={!correctionNotes.trim()}
                className="flex-1 py-2.5 rounded-xl font-bold bg-amber-500 text-navy-950 hover:bg-amber-400 disabled:bg-slate-800"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
