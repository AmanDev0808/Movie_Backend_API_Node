import React, { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

const CountUpNumber = ({ value, prefix = "", suffix = "", duration = 1.0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }
    
    const controls = animate(0, value, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      }
    });
    
    return () => controls.stop();
  }, [value, duration]);

  if (typeof value !== 'number') {
    return <span className="truncate max-w-full block">{value || 'N/A'}</span>;
  }

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

export default CountUpNumber;
