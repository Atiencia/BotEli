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
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad)"/>
      <path d="M12 7.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm0 7.375A2.875 2.875 0 1 1 14.875 12 2.875 2.875 0 0 1 12 14.875Zm3.875-6.81a1.06 1.06 0 1 1 1.06-1.06 1.06 1.06 0 0 1-1.06 1.06Z" fill="white"/>
      <path d="M17 5.5H7A1.5 1.5 0 0 0 5.5 7v10A1.5 1.5 0 0 0 7 18.5h10A1.5 1.5 0 0 0 18.5 17V7A1.5 1.5 0 0 0 17 5.5Zm.25 11.5A1.25 1.25 0 0 1 16 18.25H8A1.25 1.25 0 0 1 6.75 17V7A1.25 1.25 0 0 1 8 5.75h8A1.25 1.25 0 0 1 17.25 7Z" fill="white"/>
    </svg>
  );
};
