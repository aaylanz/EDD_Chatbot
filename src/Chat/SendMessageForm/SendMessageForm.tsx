import { FC, KeyboardEventHandler } from 'react';
import { useCallback, useRef } from 'react';
import './SendMessageForm.css';
import { FileUpload } from '../FileUpload/FileUpload';

interface SendMessageFormProps {
  onFileUpload: (files: FileList) => void;
  onKeyUp: KeyboardEventHandler<HTMLInputElement>;
  onSubmit: (text: string) => void;
  disabled: boolean;
}

export const SendMessageForm: FC<SendMessageFormProps> = ({
  disabled,
  onFileUpload,
  onKeyUp,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    const text = inputRef.current?.value.trim();
    if (text) {
      onSubmit(text);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [disabled, onSubmit]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
      }
      onKeyUp(event);
    },
    [handleSubmit, onKeyUp],
  );

  return (
    <div className="chat-input-area">
      <input
        type="text"
        className="chat-input"
        ref={inputRef}
        placeholder="Type a message..."
        disabled={disabled}
        onKeyPress={handleKeyPress}
      />
      <button className="send-btn" onClick={handleSubmit} disabled={disabled}>
        Send
      </button>
      <FileUpload onFileUpload={onFileUpload} disabled={disabled} />
    </div>
  );
};
