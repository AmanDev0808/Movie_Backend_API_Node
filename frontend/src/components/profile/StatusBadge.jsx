import React from 'react';
import { Ticket, CreditCard, CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status, type = 'booking' }) => {
  const getStyles = () => {
    if (type === 'booking') {
      switch (status) {
        case 'COMPLETED':
          return {
            classes: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
            icon: <CheckCircle2 size={10} className="text-green-400" />,
            label: 'Completed'
          };
        case 'UPCOMING':
          return {
            classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
            icon: <Clock size={10} className="text-blue-400 animate-pulse" />,
            label: 'Upcoming'
          };
        case 'PENDING':
          return {
            classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)] animate-pulse',
            icon: <AlertCircle size={10} className="text-yellow-400" />,
            label: 'Pending'
          };
        case 'CANCELLED':
        case 'FAILED':
          return {
            classes: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
            icon: <XCircle size={10} className="text-red-400" />,
            label: status === 'FAILED' ? 'Failed' : 'Cancelled'
          };
        default:
          return {
            classes: 'bg-white/5 text-white/50 border-white/5',
            icon: <Ticket size={10} />,
            label: status
          };
      }
    } else {
      // Payment badge
      switch (status) {
        case 'SUCCESS':
          return {
            classes: 'bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]',
            icon: <CreditCard size={10} className="text-teal-400" />,
            label: 'Paid'
          };
        case 'REFUNDED':
          return {
            classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
            icon: <CreditCard size={10} className="text-blue-400" />,
            label: 'Refunded'
          };
        case 'FAILED':
          return {
            classes: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
            icon: <CreditCard size={10} className="text-red-400" />,
            label: 'Failed'
          };
        case 'PENDING':
        default:
          return {
            classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse',
            icon: <CreditCard size={10} className="text-amber-400" />,
            label: 'Pending'
          };
      }
    }
  };

  const style = getStyles();

  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 border transition-all duration-300 ${style.classes}`}>
      {style.icon}
      <span>{style.label}</span>
    </span>
  );
};

export default StatusBadge;
