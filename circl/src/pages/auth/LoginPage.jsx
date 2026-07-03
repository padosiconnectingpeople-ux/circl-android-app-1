import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import Button from '@components/common/Button';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithPhone, verifyOTP, loading, error, clearError } = useAuthStore();
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState('resident'); // 'resident' | 'society' | 'business'
  const [showPhone, setShowPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      sessionStorage.setItem('role', selectedRole);
      navigate('/onboarding', { replace: true });
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 10) return;
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
    // Note: In production, recaptcha would be set up
    // For now, we'll handle this gracefully
    try {
      const result = await signInWithPhone(formattedPhone, window.recaptchaVerifier);
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setStep('otp');
      }
    } catch (e) {
      console.error('Phone auth error:', e);
    }
  };

  const handleOTPVerify = async () => {
    if (!otp || otp.length !== 6) return;
    const result = await verifyOTP(confirmationResult, otp);
    if (result.success) {
      sessionStorage.setItem('role', selectedRole);
      navigate('/onboarding', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top section with logo */}
      <div className="flex-1 flex flex-col items-center justify-center px-container-margin">
        {/* Logo */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-4">
          <svg width="96" height="96" viewBox="0 0 128 128" fill="none">
            <path
              d="M100 30C115 45 120 70 110 95C95 125 55 128 30 110C5 92 0 50 20 25C35 5 65 0 85 10"
              stroke="#5B4FE8"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(91,79,232,0.4)]" />
        </div>

        <h1 className="text-display-lg font-extrabold text-primary tracking-tight">Circl</h1>
        <p className="text-body-md text-text-muted mt-2 text-center">{t('tagline')}</p>
        <p className="text-label-md text-text-sub mt-1">{t('welcomeDesc')}</p>
      </div>

      {/* Auth Section */}
      <div className="bg-card rounded-t-3xl shadow-modal px-6 pt-8 pb-10 space-y-4">
        {/* Sign Up Type Selector */}
        <div className="space-y-2">
          <label className="text-label-md font-semibold text-on-surface block text-center uppercase tracking-wider text-text-muted">
            Choose Account Type
          </label>
          <div className="grid grid-cols-3 gap-2 bg-surface-container p-1 rounded-xl">
            {[
              { id: 'resident', label: 'Resident 🏠' },
              { id: 'society', label: 'Society 🏢' },
              { id: 'business', label: 'Business 💼' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`py-2 text-center rounded-lg text-label-md font-bold transition-all duration-200 ${
                  selectedRole === r.id
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-error-container/50 text-danger rounded-button p-3 text-body-md text-center animate-fade-in">
            {error}
            <button onClick={clearError} className="ml-2 underline">Dismiss</button>
          </div>
        )}

        {!showPhone ? (
          <>
            {/* Google Sign In */}
            <Button
              variant="ghost"
              size="full"
              onClick={handleGoogleSignIn}
              loading={loading}
              className="!border-outline-variant hover:!bg-surface-container h-14 !rounded-2xl !text-on-surface"
            >
              <div className="flex items-center gap-3 w-full justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-semibold">{t('signInWithGoogle')}</span>
              </div>
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-outline-variant/30" />
              <span className="text-label-md text-text-muted">or</span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>

            {/* Phone Sign In */}
            <Button
              variant="primary"
              size="full"
              onClick={() => setShowPhone(true)}
              icon={Phone}
              className="h-14 !rounded-2xl"
            >
              {t('signInWithPhone')}
            </Button>

            {/* Guest Browse */}
            <button
              onClick={() => {
                sessionStorage.setItem('guest', 'true');
                sessionStorage.setItem('role', selectedRole);
                navigate('/', { replace: true });
              }}
              className="w-full text-center text-body-md text-primary font-medium py-3 hover:underline"
            >
              {t('guestBrowse')} <ArrowRight className="inline w-4 h-4" />
            </button>
          </>
        ) : (
          // Phone auth flow
          <div className="space-y-4 animate-fade-in">
            {step === 'phone' ? (
              <>
                <h3 className="text-headline-sm font-semibold">{t('enterPhone')}</h3>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-surface-container rounded-button border border-outline-variant text-body-md font-medium">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="XXXXX XXXXX"
                    className="input-field flex-1"
                    maxLength={10}
                    autoFocus
                  />
                </div>
                <div id="recaptcha-container" />
                <Button
                  variant="primary"
                  size="full"
                  onClick={handlePhoneSubmit}
                  loading={loading}
                  disabled={phoneNumber.length !== 10}
                  className="h-14 !rounded-2xl"
                >
                  Send OTP
                </Button>
                <button
                  onClick={() => { setShowPhone(false); setStep('phone'); }}
                  className="w-full text-center text-body-md text-text-muted py-2"
                >
                  ← {t('back')}
                </button>
              </>
            ) : (
              <>
                <h3 className="text-headline-sm font-semibold">{t('enterOTP')}</h3>
                <p className="text-body-md text-text-muted">
                  Sent to +91 {phoneNumber}
                </p>
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const newOtp = otp.split('');
                        newOtp[i] = val;
                        setOtp(newOtp.join(''));
                        if (val && e.target.nextElementSibling) {
                          e.target.nextElementSibling.focus();
                        }
                      }}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-outline-variant rounded-button focus:border-primary focus:outline-none transition-colors"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <Button
                  variant="primary"
                  size="full"
                  onClick={handleOTPVerify}
                  loading={loading}
                  disabled={otp.length !== 6}
                  className="h-14 !rounded-2xl"
                >
                  {t('verifyOTP')}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
