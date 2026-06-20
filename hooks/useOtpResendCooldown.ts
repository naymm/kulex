import { useCallback, useEffect, useState } from 'react';
import { OTP_RESEND_COOLDOWN_SECONDS } from '@/constants/otp';

export function formatOtpResendCountdown(secondsLeft: number) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

export function useOtpResendCooldown(cooldownSeconds = OTP_RESEND_COOLDOWN_SECONDS) {
  const [secondsLeft, setSecondsLeft] = useState(cooldownSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const restart = useCallback(() => {
    setSecondsLeft(cooldownSeconds);
  }, [cooldownSeconds]);

  return {
    secondsLeft,
    canResend: secondsLeft === 0,
    restart,
  };
}
