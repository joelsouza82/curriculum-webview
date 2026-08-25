import React from 'react';

export function Icon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const emailPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
  />
);

export const lockPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
  />
);

export const userPlusPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
  />
);

export const checkPath = (
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
);

export const arrowRightPath = (
  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
);

export const inboxPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M2.25 13.5V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.5M2.25 13.5l1.591-6.363A2.25 2.25 0 015.99 5.25h12.02a2.25 2.25 0 012.149 1.887l1.591 6.363"
  />
);

export const documentArrowUpPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zM12 12.75l-3 3m0 0l3 3m-3-3h9"
  />
);

export const userPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
  />
);

export const avatarPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
  />
);

export const identificationPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5Zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0Zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0Z"
  />
);

export const mapPinPath = (
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0Z" />
);

export const mapPinOutline = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0Z"
  />
);

export const mapPinFull = (
  <>
    {mapPinPath}
    {mapPinOutline}
  </>
);

export const buildingPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M3.75 21h16.5M4.5 3h15M5.25 3v18M18.75 3v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
  />
);

export const hashtagPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
  />
);

export const phonePath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25Z"
  />
);

export const globePath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
  />
);

export const linkPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
  />
);

export const codeBracketPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
  />
);

export const calendarPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
  />
);

export const alertPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
  />
);

export const trashPath = (
  <>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104a2.25 2.25 0 0 1 4.5 0V4.5h-4.5V3.104Z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 4.5h15M6 4.5v13.5A2.25 2.25 0 0 0 8.25 20.25h7.5A2.25 2.25 0 0 0 18 18V4.5M9.75 9.75v6m4.5-6v6"
    />
  </>
);

export const xMarkPath = (
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
);

export const PERSONAL_FIELD_ICONS: Record<string, React.ReactNode> = {
  name: userPath,
  rg: identificationPath,
  document: identificationPath,
  address: mapPinFull,
  neighborhood: mapPinFull,
  city: buildingPath,
  state: mapPinFull,
  cep: hashtagPath,
  phone: phonePath,
  email: emailPath,
  website: globePath,
  linkedin: linkPath,
  github: codeBracketPath,
  birthdate: calendarPath,
};
