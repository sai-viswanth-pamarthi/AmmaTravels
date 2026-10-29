'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCheck2,
  AlertCircle,
  FileText,
  Shield,
  CheckCircle2,
  Trash2,
  Clock,
} from 'lucide-react';
import { CustomerDocument, DocumentType } from '@/lib/types';
import { store } from '@/lib/store';
import { DocumentStatusBadge } from './StatusBadge';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export function DocumentUploader({
  userId,
  onUploadSuccess,
}: {
  userId: string;
  onUploadSuccess?: (doc: CustomerDocument) => void;
}) {
  const [documents, setDocuments] = useState<CustomerDocument[]>(() =>
    store.getCustomerDocuments(userId)
  );
  const [docType, setDocType] = useState<DocumentType>('driving_license');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validation 1: Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError('File size exceeds the 5MB maximum limit. Please upload a smaller file.');
      return;
    }

    // Validation 2: MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setUploadError('Invalid file format. Only JPEG, PNG, WEBP images and PDF documents are permitted.');
      return;
    }

    // Validation 3: Consent
    if (!consentGiven) {
      setUploadError('Please accept the privacy and verification consent before uploading documents.');
      return;
    }

    setIsUploading(true);

    try {
      // Create local preview URL or base64 representation
      let previewUrl = '';
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }

      // Record to store (with private storage path simulation)
      const newDoc = store.addDocument({
        userId,
        documentType: docType,
        fileName: file.name,
        storagePath: `secure_vault/${userId}/${Date.now()}_${file.name}`,
        fileSizeBytes: file.size,
        mimeType: file.type,
        filePreviewUrl: previewUrl,
      });

      const updated = store.getCustomerDocuments(userId);
      setDocuments(updated);
      if (onUploadSuccess) onUploadSuccess(newDoc);

      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold-400" />
              Upload Rental Verification Documents
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Required by Motor Vehicles Act for self-drive vehicle release. Upload Driving License (Mandatory) and Aadhaar / ID.
            </p>
          </div>
        </div>

        {uploadError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Document Category
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            >
              <option value="driving_license">Driving License (Front/Back)</option>
              <option value="aadhaar_card">Aadhaar Card (Original ID)</option>
              <option value="passport">Passport / Other ID</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Select Document File (JPG, PNG, PDF up to 5MB)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-navy-800 file:text-gold-400 hover:file:bg-navy-700 cursor-pointer bg-navy-950 rounded-xl p-1 border border-navy-700"
            />
          </div>
        </div>

        {/* Privacy Notice and Consent */}
        <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800/80 mb-4 text-xs text-slate-400 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 rounded border-navy-700 text-gold-500 focus:ring-gold-500/30"
            />
            <span className="text-[11px] leading-relaxed">
              I consent to Amma Travels verifying my driving license and identification strictly for rental compliance in Kakinada, AP. Documents are stored in secure private storage and retained only as required by statutory transport laws.
            </span>
          </label>
        </div>

        {isUploading && (
          <div className="flex items-center justify-center gap-2 text-xs text-gold-400 font-medium py-2">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Encrypting and uploading document securely...</span>
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Uploaded Documents ({documents.length})</span>
          <span className="text-xs font-normal text-slate-400">
            Staff manual verification required
          </span>
        </h4>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-gold-400" />
            No documents uploaded yet. Upload your Driving License to expedite pickup.
          </div>
        ) : (
          <div className="divide-y divide-navy-800">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-navy-950 border border-navy-800 flex items-center justify-center text-gold-400 shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md">
                      {doc.fileName}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {doc.documentType.replace('_', ' ')} • {(doc.fileSizeBytes / 1024).toFixed(0)} KB • Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DocumentStatusBadge status={doc.status} />
                  {doc.correctionNotes && (
                    <span className="text-[11px] text-rose-300 italic">
                      Note: {doc.correctionNotes}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
