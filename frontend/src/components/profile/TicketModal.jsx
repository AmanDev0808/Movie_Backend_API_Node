import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, X, Printer, MapPin, Calendar, Clock, Ticket as TicketIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const TicketModal = ({ isOpen, booking, onClose }) => {
  const ticketRef = useRef(null);

  if (!isOpen || !booking) return null;

  const show = booking.showId || {};
  const movie = show.movieId || {};
  const theatre = show.theatreId || {};

  const formattedShowDate = show.showDate ? new Date(show.showDate).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'TBA';

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/success/${booking._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Ticket link copied to clipboard! Share it with friends.', {
      theme: 'dark',
      icon: <Share2 className="text-red-500" />
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${movie.name}</title>
          <style>
            body {
              background-color: #050505;
              color: #ffffff;
              font-family: 'Helvetica Neue', Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .ticket-container {
              border: 2px dashed #333;
              padding: 40px;
              border-radius: 20px;
              max-width: 600px;
              text-align: center;
              background: #111;
            }
            h1 { color: #e50914; margin-top: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; }
            h2 { margin: 5px 0 20px 0; font-size: 24px; font-weight: 800; }
            .details { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; text-align: left; margin: 20px 0; border-top: 1px solid #222; border-bottom: 1px solid #222; padding: 20px 0; }
            .label { font-size: 10px; text-transform: uppercase; color: #666; font-weight: bold; letter-spacing: 1px; }
            .value { font-size: 15px; font-weight: bold; color: #fff; margin-top: 4px; }
            .qr-placeholder { width: 120px; height: 120px; background: white; margin: 20px auto; display: flex; align-items: center; justify-content: center; padding: 10px; border-radius: 10px; }
            .barcode { font-family: monospace; letter-spacing: 5px; color: #444; margin-top: 10px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <h1>CINEVERSE</h1>
            <h2>${movie.name || 'Movie'}</h2>
            <div class="details">
              <div>
                <div class="label">Theatre</div>
                <div class="value">${theatre.name || 'TBA'} (${theatre.city || 'TBA'})</div>
              </div>
              <div>
                <div class="label">Date & Time</div>
                <div class="value">${formattedShowDate} at ${show.showTime || 'TBA'}</div>
              </div>
              <div>
                <div class="label">Seats</div>
                <div class="value">${booking.seatNumbers ? booking.seatNumbers.map(s => '#' + s).join(', ') : 'TBA'}</div>
              </div>
              <div>
                <div class="label">Booking ID</div>
                <div class="value">${booking._id}</div>
              </div>
              <div>
                <div class="label">Price Paid</div>
                <div class="value">₹${booking.totalCost}</div>
              </div>
              <div>
                <div class="label">Status</div>
                <div class="value" style="color: #10b981;">VERIFIED SUCCESS</div>
              </div>
            </div>
            <div class="qr-placeholder">
              <svg width="100" height="100" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm2 2h1v1H3V3zm6-3h1v1H9V0zm2 0h2v1h-2V0zm3 0h1v2h-1V0zm2 0h1v1h-1V0zm1 0h1v1h-1V0zm2 0h3v7h-7V0zm1 1v5h5V1h-5zm2 2h1v1h-3V3zm-13 5h1v1H8V8zm1 0h1v2H9V8zm2 0h1v1h-1V8zm1 0h2v1h-2V8zm4 0h1v2h-1V8zm2 0h1v1h-1V8zm1 0h1v1h-1V8zm-15 2h2v1H3v-1zm4 0h1v1H7v-1zm4 0h1v1h-1v-1zm5 0h2v2h-2v-2zm3 0h1v1h-1v-1zm1 0h1v1h-1v-1zm-19 2h7v7H0v-7zm1 1v5h5v-5H1zm2 2h1v1H3v-1zm6-3h1v1H9v-1zm1 0h1v2h-1v-2zm2 0h1v1h-1v-1zm1 0h1v1h-1v-1zm1 0h2v1h-2v-1zm3 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-9 3h1v1H9v-1zm1 0h1v1h-1v-1zm1 0h1v1h-1v-1zm2 0h2v1h-2v-1zm3 0h1v1h-1v-1zm-13 4h1v1H3v-1zm2 0h1v1H5v-1zm3 0h1v2H8v-2zm2 0h1v1h-1v-1zm1 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h2v1h-2v-1zm3 0h1v1h-1v-1zm1 0h1v1h-1v-1z" fill="#000"/>
              </svg>
            </div>
            <div class="barcode">||||| | |||| ||| || ||||| |</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const svgString = `
      <svg width="600" height="300" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="300" rx="20" fill="#0c0c0c"/>
        <rect x="2" y="2" width="596" height="296" rx="18" stroke="#e50914" stroke-width="1.5" stroke-dasharray="6 3"/>
        <line x1="420" y1="0" x2="420" y2="300" stroke="#262626" stroke-width="2" stroke-dasharray="6 6"/>
        
        <!-- Notches -->
        <circle cx="420" cy="0" r="14" fill="#000"/>
        <circle cx="420" cy="300" r="14" fill="#000"/>
        
        <!-- Cineverse Title -->
        <text x="30" y="50" fill="#e50914" font-family="Arial" font-size="26" font-weight="900" letter-spacing="-1">CINEVERSE</text>
        <text x="30" y="70" fill="#444" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">CINEMATIC DIGITAL ENTRY PASS</text>
        
        <!-- Movie Title -->
        <text x="30" y="115" fill="#ffffff" font-family="Arial" font-size="22" font-weight="bold">${movie.name || 'Movie'}</text>
        
        <!-- Details -->
        <text x="30" y="165" fill="#555" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">THEATRE</text>
        <text x="30" y="182" fill="#ffffff" font-family="Arial" font-size="12" font-weight="bold">${theatre.name || 'TBA'}</text>
        
        <text x="240" y="165" fill="#555" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">DATE & TIME</text>
        <text x="240" y="182" fill="#ffffff" font-family="Arial" font-size="12" font-weight="bold">${formattedShowDate.substring(0, 15)} at ${show.showTime || 'TBA'}</text>
        
        <text x="30" y="225" fill="#555" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">SEATS</text>
        <text x="30" y="242" fill="#e50914" font-family="Arial" font-size="14" font-weight="bold">${booking.seatNumbers ? booking.seatNumbers.map(s => '#' + s).join(', ') : 'TBA'}</text>
        
        <text x="180" y="225" fill="#555" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">BOOKING ID</text>
        <text x="180" y="242" fill="#ffffff" font-family="Courier" font-size="10" font-weight="bold">${booking._id}</text>
        
        <text x="300" y="225" fill="#555" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">PRICE</text>
        <text x="300" y="242" fill="#ffffff" font-family="Arial" font-size="13" font-weight="bold">₹${booking.totalCost}</text>
        
        <!-- Stub (Right side) -->
        <text x="440" y="50" fill="#e50914" font-family="Arial" font-size="14" font-weight="900">STUB</text>
        <text x="440" y="70" fill="#ffffff" font-family="Arial" font-size="12" font-weight="bold" width="130">${(movie.name || 'Movie').substring(0, 12)}...</text>
        <text x="440" y="105" fill="#555" font-family="Arial" font-size="8" font-weight="bold">SEATS</text>
        <text x="440" y="120" fill="#ffffff" font-family="Arial" font-size="11" font-weight="bold">${booking.seatNumbers ? booking.seatNumbers.join(',') : 'TBA'}</text>
        
        <!-- Barcode -->
        <rect x="440" y="150" width="130" height="35" fill="#151515"/>
        <rect x="448" y="155" width="4" height="25" fill="#444"/>
        <rect x="456" y="155" width="2" height="25" fill="#444"/>
        <rect x="460" y="155" width="5" height="25" fill="#444"/>
        <rect x="470" y="155" width="1" height="25" fill="#444"/>
        <rect x="474" y="155" width="3" height="25" fill="#444"/>
        <rect x="482" y="155" width="7" height="25" fill="#444"/>
        <rect x="494" y="155" width="2" height="25" fill="#444"/>
        <rect x="500" y="155" width="4" height="25" fill="#444"/>
        <rect x="508" y="155" width="2" height="25" fill="#444"/>
        <rect x="514" y="155" width="5" height="25" fill="#444"/>
        
        <text x="440" y="215" fill="#555" font-family="Arial" font-size="7" font-weight="bold">SCAN AT COUNTER</text>
        <text x="440" y="230" fill="#10b981" font-family="Arial" font-size="9" font-weight="bold">STATUS: VERIFIED</text>
      </svg>
    `;

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${booking._id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Your premium cinematic SVG ticket is downloaded!', { theme: 'dark' });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
        {/* Main modal container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative max-w-2xl w-full"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute -top-14 right-0 p-3 bg-white/5 hover:bg-red-600 rounded-full text-white border border-white/5 hover:border-red-500/20 hover:shadow-[0_0_15px_rgba(229,9,20,0.4)] transition-all duration-300 cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Ticket Body */}
          <div 
            ref={ticketRef} 
            className="glass relative rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-white/10 shadow-[0_0_80px_rgba(229,9,20,0.18)] bg-neutral-950/85"
          >
            {/* Background glowing gradients */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Main Part (Left) */}
            <div className="flex-grow p-6 md:p-8 flex flex-col justify-between text-left">
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-red-500 font-black tracking-tighter text-2xl">
                    <TicketIcon size={24} />
                    <span>CINEVERSE</span>
                  </div>
                  <span className="text-[9px] font-black text-white/30 tracking-widest uppercase block mt-1">Digital Movie Ticket</span>
                </div>
                
                <div className="text-right">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
                    Verified
                  </span>
                </div>
              </div>

              {/* Movie Info & Poster */}
              <div className="my-6 flex gap-4 items-center">
                <div className="w-16 h-24 bg-neutral-900 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-lg">
                  <img 
                    src={movie.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'} 
                    alt={movie.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-black text-white/40 tracking-widest uppercase block mb-1">Movie Selection</span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white line-clamp-2 max-w-[260px]">
                    {movie.name}
                  </h2>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-white/5 pt-5 mt-auto text-xs">
                <div>
                  <span className="text-[9px] font-black text-white/35 tracking-widest uppercase block mb-1">Theatre</span>
                  <div className="font-bold text-white/80 flex items-center gap-1.5">
                    <MapPin size={13} className="text-red-500 flex-shrink-0" />
                    <span className="truncate max-w-[180px]">{theatre.name}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-black text-white/35 tracking-widest uppercase block mb-1">Show Time</span>
                  <div className="font-bold text-white/80 flex items-center gap-1.5">
                    <Clock size={13} className="text-red-500" />
                    <span>{show.showTime}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-black text-white/35 tracking-widest uppercase block mb-1">Date</span>
                  <div className="font-bold text-white/80 flex items-center gap-1.5">
                    <Calendar size={13} className="text-red-500" />
                    <span>{new Date(show.showDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-black text-white/35 tracking-widest uppercase block mb-1">Seats Reserved</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {booking.seatNumbers ? booking.seatNumbers.map(seat => (
                      <span key={seat} className="bg-white/10 border border-white/5 text-white/80 px-2 py-0.5 rounded text-[10px] font-bold">
                        #{seat}
                      </span>
                    )) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated notches separator */}
            <div className="hidden md:flex flex-col items-center justify-between py-4 relative">
              <div className="w-8 h-8 bg-neutral-950 rounded-full -mt-8 border-b border-white/10" />
              <div className="h-full border-l-2 border-dashed border-white/10 my-2" />
              <div className="w-8 h-8 bg-neutral-950 rounded-full -mb-8 border-t border-white/10" />
            </div>

            {/* Tear-off Stub (Right Part) */}
            <div className="md:w-56 p-6 md:p-8 bg-white/[0.02] border-t md:border-t-0 md:border-l border-white/5 flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-[9px] font-black text-white/45 tracking-widest uppercase block mb-3">Scan Entry Code</span>
                
                {/* Simulated QR Code Grid */}
                <div className="p-3 bg-white rounded-2xl inline-block shadow-2xl relative group">
                  <svg width="100" height="100" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm2 2h1v1H3V3zm6-3h1v1H9V0zm2 0h2v1h-2V0zm3 0h1v2h-1V0zm2 0h1v1h-1V0zm1 0h1v1h-1V0zm2 0h3v7h-7V0zm1 1v5h5V1h-5zm2 2h1v1h-3V3zm-13 5h1v1H8V8zm1 0h1v2H9V8zm2 0h1v1h-1V8zm1 0h2v1h-2V8zm4 0h1v2h-1V8zm2 0h1v1h-1V8zm1 0h1v1h-1V8zm-15 2h2v1H3v-1zm4 0h1v1H7v-1zm4 0h1v1h-1v-1zm5 0h2v2h-2v-2zm3 0h1v1h-1v-1zm1 0h1v1h-1v-1zm-19 2h7v7H0v-7zm1 1v5h5v-5H1zm2 2h1v1H3v-1zm6-3h1v1H9v-1zm1 0h1v2h-1v-2zm2 0h1v1h-1v-1zm1 0h1v1h-1v-1zm1 0h2v1h-2v-1zm3 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-9 3h1v1H9v-1zm1 0h1v1h-1v-1zm1 0h1v1h-1v-1zm2 0h2v1h-2v-1zm3 0h1v1h-1v-1zm-13 4h1v1H3v-1zm2 0h1v1H5v-1zm3 0h1v2H8v-2zm2 0h1v1h-1v-1zm1 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h2v1h-2v-1zm3 0h1v1h-1v-1zm1 0h1v1h-1v-1z" fill="#000"/>
                  </svg>
                  {/* High tech scanner red light line */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse pointer-events-none" />
                </div>
              </div>

              <div className="w-full mt-6 space-y-1">
                <span className="text-[9px] font-black text-white/30 tracking-widest uppercase block">Booking ID</span>
                <span className="font-mono text-[10px] text-white/60 select-all block truncate w-full">{booking._id}</span>
                <span className="text-[10px] font-bold text-red-500 block">₹{booking.totalCost} Paid</span>
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <button
              onClick={handlePrint}
              className="bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/5 hover:border-white/10 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <Printer size={15} className="text-red-500" />
              <span>Print Ticket</span>
            </button>
            
            <button
              onClick={handleDownload}
              className="bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/5 hover:border-white/10 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <Download size={15} className="text-red-500" />
              <span>Download SVG</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] animate-bounce"
            >
              <Share2 size={15} />
              <span>Share Ticket</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TicketModal;
