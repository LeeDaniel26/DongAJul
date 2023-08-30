import React, { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import Chatbot from './chatbot';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PDFExtract({ file }) {
    const [allText, setAllText] = useState('');

    useEffect(() => {
        async function extractTextFromFile() {
            const pdf = await pdfjs.getDocument({ url: URL.createObjectURL(file) }).promise;
            const numPages = pdf.numPages;
            let newText = '';

            for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                const page = await pdf.getPage(pageNumber);
                const content = await page.getTextContent();
                const strings = content.items.map((item) => item.str);
                newText += strings.join(' ') + ' ';
            }

            setAllText(newText);
        }

        if (file) {
            extractTextFromFile();
        }
    }, [file]);

    return (
        <div>
            <p>Extract PDF Text</p>
            <pre>{allText}</pre>
        </div>
    );
}

export default PDFExtract;