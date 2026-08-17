import React from 'react';

export const Messenger = ({ 
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
        <linearGradient id="msg-grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00B2FF"/>
          <stop offset="1" stopColor="#006AFF"/>
        </linearGradient>
      </defs>
      <path d="M12 2C6.477 2 2 6.14 2 11.25C2 14.156 3.513 16.745 5.86 18.421V22L9.366 20.088C10.203 20.334 11.085 20.5 12 20.5C17.523 20.5 22 16.36 22 11.25C22 6.14 17.523 2 12 2Z" fill="url(#msg-grad)"/>
      <path d="M12.562 14.89l-2.486-2.651-4.843 2.651 5.328-5.656 2.5 2.652 4.828-2.652-5.327 5.656Z" fill="white"/>
    </svg>
  );
};
