'use client';

import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function CookieWrapper({ children }) {
  const [cookieUsername, setCookieUsername] = useState(Cookies.get('username'));
  const router = useRouter();

  useEffect(() => {
    // Update the cookieUsername state when the cookie changes
    const handleCookieChange = () => {
      setCookieUsername(Cookies.get('username'));
    };

    // Set up an interval to regularly check for cookie changes
    const interval = setInterval(handleCookieChange, 100);

    if (!cookieUsername) {
      router.push('/signin'); // Redirect to signin page
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [cookieUsername, router]);

  return (
    <>
      {children}
    </>
  );
}
