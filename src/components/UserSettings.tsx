import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, LogOut, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileImageChange?: (imageUrl: string) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ isOpen, onClose, onProfileImageChange }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [hasUnsavedPhoto, setHasUnsavedPhoto] = useState(false);
  const navigate = useNavigate();

  const handlePasswordUpdate = () => {
    if (newPassword && newPassword === confirmPassword) {
      // Simulate password update
      alert('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert('Passwords do not match!');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Create URL for the uploaded image preview
      const imageUrl = URL.createObjectURL(file);
      setProfileImageUrl(imageUrl);
      // Mark as having unsaved changes
      setHasUnsavedPhoto(true);
    }
  };

  const handleSavePhoto = () => {
    if (profileImageUrl && hasUnsavedPhoto) {
      // Call parent callback to update the user icon
      onProfileImageChange?.(profileImageUrl);
      setHasUnsavedPhoto(false);
      alert('Profile picture saved!');
    }
  };

  const handleLogout = () => {
    navigate('/');
    onClose();
  };

  const handleClose = () => {
    // Reset unsaved changes when closing
    if (hasUnsavedPhoto) {
      setHasUnsavedPhoto(false);
      setProfileImageUrl(null);
      setProfileImage(null);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background/95 backdrop-blur-md border border-vibe-glass-border p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-dancing text-vibe-warm-brown">
                Settings
              </h3>
              <button
                onClick={handleClose}
                className="p-2 bg-background/80 border border-vibe-glass-border rounded-full hover:bg-vibe-glow-orange/20 transition-colors"
              >
                <X className="w-5 h-5 text-vibe-warm-brown" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <Label className="text-vibe-warm-brown font-dancing text-lg">
                  Profile Picture
                </Label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-vibe-soft-orange/30 flex items-center justify-center overflow-hidden">
                      {profileImageUrl ? (
                        <img 
                          src={profileImageUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">👤</span>
                      )}
                    </div>
                    {hasUnsavedPhoto && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-vibe-glow-orange rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">!</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-upload"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => document.getElementById('profile-upload')?.click()}
                      variant="outline"
                      className="border-vibe-glass-border"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                    <Button
                      onClick={handleSavePhoto}
                      disabled={!hasUnsavedPhoto}
                      className={`transition-all duration-200 ${
                        hasUnsavedPhoto 
                          ? 'bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white shadow-md hover:shadow-lg' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      Save
                    </Button>
                  </div>
                </div>
                {hasUnsavedPhoto && (
                  <p className="text-sm text-vibe-glow-orange mt-2">
                    ⚠️ You have unsaved changes. Click "Save" to apply them.
                  </p>
                )}
              </div>

              {/* Password Change */}
              <div className="space-y-4">
                <Label className="text-vibe-warm-brown font-dancing text-lg">
                  Change Password
                </Label>
                <div className="space-y-3">
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-background/90 border-vibe-glass-border"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background/90 border-vibe-glass-border"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <Button
                  onClick={handlePasswordUpdate}
                  disabled={!newPassword || newPassword !== confirmPassword}
                  className="w-full bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserSettings;