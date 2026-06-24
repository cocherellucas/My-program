import { jsPDF } from 'jspdf';

const TYPE_FR = {
  strength: 'Force', hypertrophy: 'Hypertrophie', endurance: 'Endurance',
  mixed: 'Mixte', cardio: 'Cardio', mobility: 'Mobilité',
};

// Nettoie un libellé de séance : retire "week/semaine N -" et traduit les jours anglais
function cleanLabel(raw = '') {
  return raw
    .replace(/§\d/g, '')
    .replace(/^(week|semaine)\s*\d+\s*[-–:·]?\s*/i, '')
    .replace(/\bmonday\b/gi, 'Lundi').replace(/\btuesday\b/gi, 'Mardi')
    .replace(/\bwednesday\b/gi, 'Mercredi').replace(/\bthursday\b/gi, 'Jeudi')
    .replace(/\bfriday\b/gi, 'Vendredi').replace(/\bsaturday\b/gi, 'Samedi')
    .replace(/\bsunday\b/gi, 'Dimanche')
    .trim() || 'Séance';
}

/**
 * Génère et télécharge un PDF texte d'un cycle de programme.
 * @param {{ programName?: string, subtitle?: string, sessions: Array }} opts
 */
export function exportProgramPDF({ programName = 'Mon programme', subtitle = '', sessions = [] }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const ensure = (needed) => {
    if (y + needed > pageH - margin) { doc.addPage(); y = margin; }
  };

  // En-tête
  doc.setTextColor(30, 0, 80);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22);
  doc.text(programName, margin, y); y += 26;
  if (subtitle) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(120);
    doc.text(subtitle, margin, y); y += 18;
  }
  doc.setDrawColor(124, 58, 237); doc.setLineWidth(1.5);
  doc.line(margin, y, pageW - margin, y); y += 22;
  doc.setTextColor(0);

  if (!sessions.length) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(120);
    doc.text('Aucune séance dans ce programme.', margin, y);
  }

  sessions.forEach((s) => {
    const exercises = s.exercises || [];
    ensure(54 + exercises.length * 16);

    // Titre séance
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(30, 0, 80);
    doc.text(cleanLabel(s.day_label || s.day), margin, y); y += 16;

    // Méta
    const meta = [
      TYPE_FR[s.type] || s.type,
      s.estimated_duration ? `${s.estimated_duration} min` : null,
      `${exercises.length} exercice${exercises.length > 1 ? 's' : ''}`,
    ].filter(Boolean).join('   ·   ');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(130);
    doc.text(meta, margin, y); y += 16;

    // Exercices
    doc.setFontSize(10.5); doc.setTextColor(20);
    exercises.forEach((ex) => {
      ensure(16);
      const right = [
        `${ex.sets || 3} × ${ex.target_reps || '?'}`,
        ex.target_weight ? `${ex.target_weight} ${ex.weight_unit || 'kg'}` : null,
        ex.rest_seconds ? `${ex.rest_seconds}s repos` : null,
      ].filter(Boolean).join('    ');
      doc.text(`•  ${ex.name || 'Exercice'}`, margin + 6, y);
      doc.setTextColor(110);
      doc.text(right, pageW - margin, y, { align: 'right' });
      doc.setTextColor(20);
      y += 16;
    });
    y += 16;
  });

  // Pied de page sur chaque page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(160);
    doc.text('Généré par Coach IA', margin, pageH - 24);
    doc.text(`${p}/${pages}`, pageW - margin, pageH - 24, { align: 'right' });
  }

  const safeName = (programName || 'programme').replace(/[^\w\-éèàùç ]+/gi, '').replace(/\s+/g, '_');
  doc.save(`${safeName}.pdf`);
}
