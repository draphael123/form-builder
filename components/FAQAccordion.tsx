'use client';

import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { getTranslation } from '@/lib/translations';

interface FAQItem {
  question: string;
  questionEs: string;
  answer: string;
  answerEs: string;
}

const generalFAQs: FAQItem[] = [
  {
    question: 'How long does this form take to complete?',
    questionEs: '¿Cuánto tiempo toma completar este formulario?',
    answer: 'For non-clinical staff, the form takes about 5-10 minutes. For clinical staff (MD, DO, NP, RN), it may take 15-25 minutes due to additional licensing and credentialing questions.',
    answerEs: 'Para personal no clínico, el formulario toma aproximadamente 5-10 minutos. Para personal clínico (MD, DO, NP, RN), puede tomar 15-25 minutos debido a preguntas adicionales de licencias y credenciales.',
  },
  {
    question: 'Can I save my progress and continue later?',
    questionEs: '¿Puedo guardar mi progreso y continuar después?',
    answer: 'Yes! Your progress is automatically saved to your browser. You can also click "Save & Continue Later" to receive an email link that lets you continue on any device.',
    answerEs: '¡Sí! Tu progreso se guarda automáticamente en tu navegador. También puedes hacer clic en "Guardar y Continuar Después" para recibir un enlace por correo electrónico que te permite continuar en cualquier dispositivo.',
  },
  {
    question: 'Is my information secure?',
    questionEs: '¿Mi información está segura?',
    answer: 'Yes, all data is encrypted in transit and at rest. Your sensitive information like SSN is masked and securely stored. We comply with healthcare data protection standards.',
    answerEs: 'Sí, todos los datos están encriptados en tránsito y en reposo. Tu información sensible como el SSN está enmascarada y almacenada de forma segura. Cumplimos con los estándares de protección de datos de salud.',
  },
  {
    question: 'What file formats are accepted for uploads?',
    questionEs: '¿Qué formatos de archivo se aceptan para las cargas?',
    answer: 'We accept PDF, JPG, JPEG, and PNG files. Most uploads have a 10MB size limit, with some documents allowing up to 15MB.',
    answerEs: 'Aceptamos archivos PDF, JPG, JPEG y PNG. La mayoría de las cargas tienen un límite de 10MB, con algunos documentos permitiendo hasta 15MB.',
  },
  {
    question: 'What happens after I submit?',
    questionEs: '¿Qué sucede después de enviar?',
    answer: "You'll receive a confirmation email with your submission details and a PDF copy. Our HR team will review your information and contact you if any additional documentation is needed.",
    answerEs: 'Recibirás un correo electrónico de confirmación con los detalles de tu envío y una copia en PDF. Nuestro equipo de RH revisará tu información y te contactará si se necesita documentación adicional.',
  },
];

const clinicalFAQs: FAQItem[] = [
  {
    question: 'What is an NPDB Self-Query Report?',
    questionEs: '¿Qué es un informe de auto-consulta NPDB?',
    answer: 'The National Practitioner Data Bank (NPDB) Self-Query Report is a document that shows your history of malpractice payments, adverse licensure actions, and other reported information. You can request one at npdb.hrsa.gov.',
    answerEs: 'El Informe de Auto-Consulta del Banco Nacional de Datos de Profesionales (NPDB) es un documento que muestra tu historial de pagos por mala praxis, acciones adversas de licencias y otra información reportada. Puedes solicitar uno en npdb.hrsa.gov.',
  },
  {
    question: 'Where can I get my Nursys verification?',
    questionEs: '¿Dónde puedo obtener mi verificación Nursys?',
    answer: 'You can obtain a Nursys Quick Confirm License Verification report at nursys.com. The report must be pulled within the last 30 days.',
    answerEs: 'Puedes obtener un informe de Verificación de Licencia Nursys Quick Confirm en nursys.com. El informe debe ser obtenido dentro de los últimos 30 días.',
  },
  {
    question: 'Do I need to list all my state licenses?',
    questionEs: '¿Necesito listar todas mis licencias estatales?',
    answer: 'Yes, please list all active and inactive/expired medical licenses, including the state, license number, issue date, and expiration date for each.',
    answerEs: 'Sí, por favor lista todas las licencias médicas activas e inactivas/expiradas, incluyendo el estado, número de licencia, fecha de emisión y fecha de expiración de cada una.',
  },
];

interface FAQAccordionProps {
  isClinicalStaff?: boolean;
}

export function FAQAccordion({ isClinicalStaff = false }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const { settings } = useAccessibility();
  const language = settings.language;

  const faqs = isClinicalStaff ? [...generalFAQs, ...clinicalFAQs] : generalFAQs;

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="faq-accordion">
      <div className="faq-trigger" style={{ cursor: 'default', background: 'var(--color-cream)' }}>
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--color-terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {getTranslation('faq.title', language)}
        </span>
      </div>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <button
            type="button"
            className="faq-trigger"
            onClick={() => toggleItem(index)}
            aria-expanded={openItems.has(index)}
          >
            <span>{language === 'es' ? faq.questionEs : faq.question}</span>
            <svg
              className="faq-trigger-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openItems.has(index) && (
            <div className="faq-content">
              {language === 'es' ? faq.answerEs : faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
