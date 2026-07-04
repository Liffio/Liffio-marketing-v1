'use client';

import { useEffect } from 'react';
import { captureReferralFromUrl } from '@/lib/auth/referral';

export function ReferralCapture() {
  useEffect(() => {
    if (window.location.search.includes('ref=')) {
      captureReferralFromUrl(window.location.search);
    }
  }, []);

  return null;
}
