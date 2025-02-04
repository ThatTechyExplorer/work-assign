import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { FirebaseError } from 'firebase/app';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Signed in successfully');
      navigate('/');
    } catch (err) {
      console.error('Sign in error:', err);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          case 'auth/user-disabled':
            setError('This account has been disabled');
            break;
          case 'auth/user-not-found':
            setError('No account found with this email');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password');
            break;
          default:
            setError('Failed to sign in. Please try again.');
        }
      } else {
        setError('An unexpected error occurred');
      }
      toast.error(error || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google successfully');
      navigate('/');
    } catch (err) {
      console.error('Google sign in error:', err);
      setError('Failed to sign in with Google');
      toast.error('Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-worksheet-600 text-white font-bold text-2xl shadow-lg">
            T
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-worksheet-600 to-worksheet-800 text-transparent bg-clip-text">
            Work-Assign
          </h1>
        </div>
        <div className="bg-white py-10 px-8 shadow-xl rounded-xl border border-gray-100">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-2xl font-semibold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-center text-sm text-gray-600 mb-8">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-worksheet-600 hover:text-worksheet-500 transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 border-gray-200 focus:border-worksheet-500 focus:ring-worksheet-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 border-gray-200 focus:border-worksheet-500 focus:ring-worksheet-500"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-worksheet-600 hover:bg-worksheet-700 shadow-sm transition-all duration-200 hover:shadow flex items-center justify-center gap-2 py-5"
                disabled={loading}
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-200 hover:bg-gray-50 shadow-sm transition-all duration-200 hover:shadow flex items-center justify-center gap-2 py-5"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 