import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage = () => {
  const { login, loginAsAdmin } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) {
      toast.error('Enter a valid phone number');
      return;
    }
    setOtpSent(true);
    toast.success('OTP sent! (Use 1234 for demo)');
  };

  const handleVerify = () => {
    if (otp !== '1234') {
      toast.error('Invalid OTP. Use 1234 for demo.');
      return;
    }
    login(phone, name || 'User');
    toast.success('Welcome!');
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <span className="text-5xl block mb-3">🥬</span>
          <h1 className="font-display font-bold text-2xl text-foreground">Welcome to FreshCart</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to order fresh groceries</p>
        </div>

        <div className="bg-card rounded-xl p-6 card-elevated space-y-4">
          {!otpSent ? (
            <>
              <div className="space-y-2">
                <Label className="text-foreground">Your Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Mobile Number</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" type="tel" maxLength={10} />
              </div>
              <Button className="w-full" onClick={handleSendOtp}>Send OTP</Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-foreground">Enter OTP</Label>
                <Input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 4-digit OTP" maxLength={4} />
                <p className="text-xs text-muted-foreground">Demo OTP: 1234</p>
              </div>
              <Button className="w-full" onClick={handleVerify}>Verify & Login</Button>
              <Button variant="ghost" className="w-full text-sm" onClick={() => setOtpSent(false)}>Change Number</Button>
            </>
          )}
        </div>

        <div className="text-center">
          <Button variant="link" className="text-xs text-muted-foreground" onClick={() => { loginAsAdmin(); navigate('/admin'); toast.success('Logged in as Admin'); }}>
            Login as Admin (Demo)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
