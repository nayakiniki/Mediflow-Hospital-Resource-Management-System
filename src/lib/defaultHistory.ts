import { HistoryItem } from '../types';
import { SAMPLE_NOTES } from './sampleNotes';
import { parseClinicalText } from './clinicalParser';

export function getInitialHistory(): HistoryItem[] {
  return SAMPLE_NOTES.map((sample, idx) => {
    const report = parseClinicalText(sample.text, idx === 1 ? 'file' : 'text', sample.filename);
    const dateOffset = idx * 24 * 60 * 60 * 1000;
    const pastDate = new Date(Date.now() - dateOffset);
    
    report.created_at = pastDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      id: `hist-${sample.id}`,
      title: report.title,
      filename: sample.filename,
      snippet: sample.text.slice(0, 130).replace(/\n/g, ' ') + '...',
      date: report.created_at,
      status: report.status,
      report
    };
  });
}
