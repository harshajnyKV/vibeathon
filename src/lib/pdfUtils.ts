import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'a3' | 'letter';
}

export const generatePDF = async (
  elementId?: string,
  options: PDFOptions = {}
): Promise<void> => {
  try {
    const {
      filename = 'vibe-report.pdf',
      quality = 1,
      scale = 2,
      orientation = 'portrait',
      format = 'a4'
    } = options;

    // Get the element to capture (default to body if no elementId provided)
    const element = elementId 
      ? document.getElementById(elementId) 
      : document.body;

    if (!element) {
      throw new Error('Element not found for PDF generation');
    }

    // Show loading state
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'wait';

    // Generate canvas from the element
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth,
    });

    // Get canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'px',
      format: format,
    });

    // Get PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate scaling to fit content
    const widthRatio = pdfWidth / imgWidth;
    const heightRatio = pdfHeight / imgHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    // Center the content
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;

    // Convert canvas to image and add to PDF
    const imgData = canvas.toDataURL('image/png', quality);
    
    // If content is too tall, split into multiple pages
    if (scaledHeight > pdfHeight) {
      let remainingHeight = scaledHeight;
      let currentY = 0;
      let pageCount = 0;

      while (remainingHeight > 0) {
        if (pageCount > 0) {
          pdf.addPage();
        }

        const pageHeight = Math.min(remainingHeight, pdfHeight);
        
        // Create a temporary canvas for this page
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        
        if (pageCtx) {
          pageCanvas.width = imgWidth;
          pageCanvas.height = (pageHeight / ratio);
          
          // Draw the portion of the original canvas for this page
          pageCtx.drawImage(
            canvas,
            0, currentY / ratio,
            imgWidth, pageCanvas.height,
            0, 0,
            imgWidth, pageCanvas.height
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png', quality);
          pdf.addImage(pageImgData, 'PNG', x, 0, scaledWidth, pageHeight);
        }

        remainingHeight -= pdfHeight;
        currentY += pdfHeight;
        pageCount++;
      }
    } else {
      // Single page
      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    }

    // Add metadata
    pdf.setProperties({
      title: 'Vibe Analytics Report',
      subject: 'Employee Mood and Performance Analytics',
      author: 'Vibe Analytics System',
      creator: 'Vibe App'
    });

    // Download the PDF
    pdf.save(filename);

    // Reset cursor
    document.body.style.cursor = originalCursor;

  } catch (error) {
    // Reset cursor on error
    document.body.style.cursor = 'default';
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Specific function for dashboard/admin reports
export const generateReportPDF = async (pageTitle: string = 'Analytics Report'): Promise<void> => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `vibe-${pageTitle.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`;
  
  await generatePDF('main-content', {
    filename,
    quality: 0.95,
    scale: 1.5,
    orientation: 'portrait',
    format: 'a4'
  });
}; 