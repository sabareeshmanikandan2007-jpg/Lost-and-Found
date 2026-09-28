import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  type = 'danger' // 'danger' | 'success'
}) => {
  const isDanger = type === 'danger';
  const headerBg = isDanger ? 'bg-lost' : 'bg-primary';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => !isLoading && onCancel()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-8"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-8"
            >
              <Dialog.Panel className="w-full max-w-lg transform bg-white brutal-border brutal-shadow-xl text-left align-middle transition-all p-0 overflow-hidden">
                <div className={`${headerBg} p-6 border-b-2 border-black flex items-center gap-4`}>
                   {isDanger ? (
                     <div className="w-12 h-12 bg-white brutal-border flex items-center justify-center shadow-[2px_2px_0_0_#000]">
                       <AlertTriangle className="h-6 w-6 text-lost" strokeWidth={3} />
                     </div>
                   ) : (
                     <div className="w-12 h-12 bg-white brutal-border flex items-center justify-center shadow-[2px_2px_0_0_#000]">
                       <CheckCircle2 className="h-6 w-6 text-charcoal" strokeWidth={3} />
                     </div>
                   )}
                   <Dialog.Title as="h3" className={`text-2xl font-display font-black uppercase tracking-tighter ${isDanger ? 'text-white' : 'text-charcoal'}`}>
                     {title}
                   </Dialog.Title>
                </div>
                
                <div className="px-8 py-6 bg-neutral">
                  <p className="text-base font-sans font-bold text-charcoal/80 leading-relaxed">
                    {message}
                  </p>
                </div>

                <div className="px-8 py-6 bg-white border-t-2 border-black flex items-center gap-4 justify-end">
                  <button
                    type="button"
                    className="brutal-btn bg-neutral text-charcoal hover:bg-white"
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    {cancelText.toUpperCase()}
                  </button>
                  <button
                    type="button"
                    className={`brutal-btn ${isDanger ? 'bg-lost text-white hover:bg-red-600' : 'bg-charcoal text-white hover:bg-black'}`}
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? 'PROCESSING...' : confirmText.toUpperCase()}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmDialog;
