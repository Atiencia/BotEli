import React from 'react';

export const Instagram = ({ 
  className = '', 
  size = 24, 
  ...props 
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient id="ig-grad" cx="0.2" cy="1" r="1" fx="0.2" fy="1">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#ig-grad)"/>
      <path d="M12 8A4 4 0 1 0 16 12 4 4 0 0 0 12 8Zm0 6.5A2.5 2.5 0 1 1 14.5 12 2.5 2.5 0 0 1 12 14.5Zm3.5-6.1a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z" fill="white"/>
      <path d="M17 4H7A3 3 0 0 0 4 7v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm1.5 13A1.5 1.5 0 0 1 17 18.5H7A1.5 1.5 0 0 1 5.5 17V7A1.5 1.5 0 0 1 7 5.5h10A1.5 1.5 0 0 1 18.5 7Z" fill="white"/>
    </svg>
  );
};
