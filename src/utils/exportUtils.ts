import { Transaction } from '../types';
import { formatDateForDisplay } from './dateUtils';
import { getCategoryLabel } from './categoryUtils';

// Export transactions to CSV
export const exportToCSV = (transactions: Transaction[]): void => {
  // Define CSV headers
  const headers = [
    'Date',
    'Type',
    'Category',
    'Description',
    'Amount',
    'Recurring',
    'Tags',
  ];
  
  // Convert transactions to CSV rows
  const rows = transactions.map(transaction => [
    formatDateForDisplay(transaction.date),
    transaction.type,
    getCategoryLabel(transaction.category),
    transaction.description,
    transaction.amount.toString(),
    transaction.isRecurring ? 'Yes' : 'No',
    transaction.tags ? transaction.tags.join(', ') : '',
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create a Blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set up download attributes
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data to PDF
export const exportToPDF = async (elementId: string, filename: string): Promise<void> => {
  try {
    // Dynamically import html2pdf.js
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }
    
    const opt = {
      margin: 10,
      filename: `${filename}_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    await html2pdf().from(element).set(opt).save();
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Failed to export PDF. Please try again later.');
  }
};