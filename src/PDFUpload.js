import React, { useState, useRef } from 'react';
import { pdfjs } from 'react-pdf';
import PDFExtract from './PDFExtract';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Upload() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const fileInputRef = useRef(null);

  function onFileChange(e) {
    setFile(e.target.files[0]);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handleUploadClick() {
    fileInputRef.current.click();
  }

  return (
    <div>
      <button onClick={handleUploadClick}>PDF Upload</button>
      <input
        type="file"
        accept=".pdf"
        onChange={onFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      {file && (
        <PDFExtract file={file} />
      )}
    </div>
  );
}

export default Upload;