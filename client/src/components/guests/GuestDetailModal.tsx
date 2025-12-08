import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Guest } from '@/types/dashboard';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GuestDetailModalProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (guest: Guest, notes: string) => Promise<void>;
}

export function GuestDetailModal({
  guest,
  isOpen,
  onClose,
  onSave,
}: GuestDetailModalProps) {
  const [notes, setNotes] = useState(guest?.admin_notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!guest || !onSave) return;

    setIsSaving(true);
    try {
      await onSave(guest, notes);
      toast.success('Notas atualizadas com sucesso');
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar notas');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'yes':
        return 'text-emerald bg-emerald/10';
      case 'no':
        return 'text-burgundy bg-burgundy/10';
      case 'maybe':
        return 'text-amber bg-amber/10';
      default:
        return 'text-soft-black bg-sand/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'yes':
        return 'Confirmado';
      case 'no':
        return 'Recusado';
      case 'maybe':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && guest && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-50"
          >
            <div className="sticky top-0 bg-gradient-to-r from-terracotta/10 to-amber/10 px-8 py-6 border-b border-sand/20 flex items-center justify-between">
              <h2 className="text-2xl font-serif text-soft-black">Detalhes do Convidado</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-sand/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-soft-black" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-3xl font-serif text-soft-black">
                      {guest.name}
                    </h3>
                    <p className="text-soft-black/60 mt-1">ID: {guest.id}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-medium text-sm ${getStatusColor(
                      guest.status
                    )}`}
                  >
                    {getStatusLabel(guest.status)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-sand/20" />

              <div>
                <h4 className="font-serif text-lg text-soft-black mb-4">Informacoes de Contato</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-sand/5 rounded-lg border border-sand/20">
                    <p className="text-sm text-soft-black/60 mb-1">Email</p>
                    <p className="font-medium text-soft-black break-all">
                      {guest.email || 'Nao fornecido'}
                    </p>
                  </div>
                  <div className="p-4 bg-sand/5 rounded-lg border border-sand/20">
                    <p className="text-sm text-soft-black/60 mb-1">Telefone</p>
                    <p className="font-medium text-soft-black">
                      {guest.phone || 'Nao fornecido'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-lg text-soft-black mb-4">Informacoes do RSVP</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-sand/5 rounded-lg border border-sand/20">
                    <p className="text-sm text-soft-black/60 mb-1">Pessoas</p>
                    <p className="text-2xl font-serif font-bold text-soft-black">
                      {guest.party_size}
                    </p>
                  </div>
                  <div className="p-4 bg-sand/5 rounded-lg border border-sand/20">
                    <p className="text-sm text-soft-black/60 mb-1">Recepcao</p>
                    <p className="font-medium text-soft-black">
                      {guest.going_to_reception ? 'Sim' : 'Nao'}
                    </p>
                  </div>
                  <div className="p-4 bg-sand/5 rounded-lg border border-sand/20">
                    <p className="text-sm text-soft-black/60 mb-1">Fonte</p>
                    <p className="font-medium text-soft-black capitalize">
                      {guest.response_source}
                    </p>
                  </div>
                </div>
              </div>

              {guest.dietary_restrictions && (
                <div>
                  <h4 className="font-serif text-lg text-soft-black mb-4">
                    Restricoes Alimentares
                  </h4>
                  <div className="p-4 bg-amber/5 border border-amber/20 rounded-lg">
                    <p className="text-soft-black">{guest.dietary_restrictions}</p>
                  </div>
                </div>
              )}

              {guest.message && (
                <div>
                  <h4 className="font-serif text-lg text-soft-black mb-4">Mensagem do Convidado</h4>
                  <div className="p-4 bg-sand/5 border border-sand/20 rounded-lg italic text-soft-black">
                    "{guest.message}"
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-serif text-lg text-soft-black mb-4">Notas Administrativas</h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione notas internas sobre este convidado..."
                  className="w-full px-4 py-3 rounded-lg border border-sand/30 focus:border-terracotta focus:outline-none resize-none h-24 text-soft-black placeholder-soft-black/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-sand/20">
                <div>
                  <p className="text-sm text-soft-black/60 mb-1">Respondido em</p>
                  <p className="font-medium text-soft-black">
                    {format(new Date(guest.created_at), 'dd MMMM yyyy HH:mm', {
                      locale: pt,
                    })}
                  </p>
                </div>
                {guest.confirmed_at && (
                  <div>
                    <p className="text-sm text-soft-black/60 mb-1">Confirmado em</p>
                    <p className="font-medium text-soft-black">
                      {format(new Date(guest.confirmed_at), 'dd MMMM yyyy HH:mm', {
                        locale: pt,
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-sand/20 px-8 py-4 flex items-center justify-end gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="border-sand/30 text-soft-black hover:bg-sand/5"
              >
                Cancelar
              </Button>
              {onSave && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-terracotta text-white hover:bg-terracotta/90"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Notas
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default GuestDetailModal;
