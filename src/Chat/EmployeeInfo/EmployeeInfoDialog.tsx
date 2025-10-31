import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { FC, useRef, useState } from 'react';

export interface EmployeeInfo {
  name: string;
  employeeId: string;
  callbackNumber: string;
}

interface EmployeeInfoDialogProps {
  open: boolean;
  onSubmit: (info: EmployeeInfo) => void;
  onCancel: () => void;
}

export const EmployeeInfoDialog: FC<EmployeeInfoDialogProps> = ({
  open,
  onSubmit,
  onCancel,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const employeeIdInputRef = useRef<HTMLInputElement>(null);
  const callbackNumberInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState({
    name: false,
    employeeId: false,
    callbackNumber: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInputRef.current?.value?.trim() || '';
    const employeeId = employeeIdInputRef.current?.value?.trim() || '';
    const callbackNumber = callbackNumberInputRef.current?.value?.trim() || '';
    const newErrors = {
      name: name === '',
      employeeId: employeeId === '',
      callbackNumber: callbackNumber === '',
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.employeeId || newErrors.callbackNumber) {
      return;
    }

    onSubmit({ name, employeeId, callbackNumber });
    setErrors({ name: false, employeeId: false, callbackNumber: false });
  };

  const handleCancel = () => {
    setErrors({ name: false, employeeId: false, callbackNumber: false });
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Employee Information Required</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please provide your information to proceed with Windows Unlock
            assistance.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              inputRef={nameInputRef}
              label="Full Name"
              placeholder="e.g., John Doe"
              required
              autoFocus
              fullWidth
              error={errors.name}
              helperText={errors.name ? 'Name is required' : ''}
              onChange={() => setErrors((prev) => ({ ...prev, name: false }))}
            />

            <TextField
              inputRef={employeeIdInputRef}
              label="Employee ID"
              placeholder="e.g., 12345"
              required
              fullWidth
              error={errors.employeeId}
              helperText={errors.employeeId ? 'Employee ID is required' : ''}
              onChange={() =>
                setErrors((prev) => ({ ...prev, employeeId: false }))
              }
            />

            <TextField
              inputRef={callbackNumberInputRef}
              label="Callback Number"
              placeholder="e.g., (555) 123-4567"
              required
              fullWidth
              type="tel"
              error={errors.callbackNumber}
              helperText={
                errors.callbackNumber ? 'Callback number is required' : ''
              }
              onChange={() =>
                setErrors((prev) => ({ ...prev, callbackNumber: false }))
              }
            />

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                mt: 2,
              }}
            >
              <Button onClick={handleCancel} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Continue
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  );
};
