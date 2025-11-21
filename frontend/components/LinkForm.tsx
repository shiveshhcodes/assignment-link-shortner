import React, { useState } from 'react';
import { CreateLinkRequest, ApiError, Link } from '../types';


interface LinkFormProps {
    onSuccess: (link: Link) => void;
}

const LinkForm: React.FC<LinkFormProps> = ({ onSuccess }) => {
    const [target, setTarget] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ target?: string; code?: string; general?: string }>({});

    const validate = (): boolean => {
        const newErrors: { target?: string; code?: string } = {};
        let isValid = true;

        if (!target) {
            newErrors.target = 'Target URL is required';
            isValid = false;
        } else {
            try {
                new URL(target);
            } catch (e) {
                newErrors.target = 'Please enter a valid URL (e.g., https://example.com)';
                isValid = false;
            }
        }

        if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
            newErrors.code = 'Code must be 6–8 alphanumeric characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
            const payload: CreateLinkRequest = { target };
            if (code) payload.code = code;

            const response = await fetch(`${baseUrl}/api/links`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 409) {
                    setErrors({ code: 'Code already exists' });
                } else if (response.status === 400) {
                    setErrors({ general: errorData.message || 'Invalid request' });
                } else {
                    throw new Error(errorData.message || 'Something went wrong');
                }
                return;
            }

            const newLink: Link = await response.json();
            onSuccess(newLink);
            setTarget('');
            setCode('');
        } catch (err: any) {
            setErrors({ general: err.message || 'Failed to create link' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="link-form" onSubmit={handleSubmit} noValidate>
            <h2 className="link-form__title">Create New Link</h2>

            {errors.general && (
                <div className="form-summary-error" role="alert">
                    {errors.general}
                </div>
            )}

            <div className="link-form__grid">
                <div className="form-group">
                    <label htmlFor="target" className="form-label">Target URL</label>
                    <input
                        id="target"
                        type="url"
                        className={`form-input ${errors.target ? 'form-input--error' : ''}`}
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="https://example.com/very/long/url"
                        disabled={isLoading}
                        aria-invalid={!!errors.target}
                        aria-describedby={errors.target ? "target-error" : undefined}
                    />
                    <div className="form-error" id="target-error" role="alert">
                        {errors.target}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="code" className="form-label">Custom Code (Optional)</label>
                    <input
                        id="code"
                        type="text"
                        className={`form-input ${errors.code ? 'form-input--error' : ''}`}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="mycode123"
                        maxLength={8}
                        disabled={isLoading}
                        aria-invalid={!!errors.code}
                        aria-describedby={errors.code ? "code-error" : undefined}
                    />
                    <div className="form-error" id="code-error" role="alert">
                        {errors.code}
                    </div>
                </div>

                <button type="submit" className="btn btn--primary" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Shorten'}
                </button>
            </div>
        </form>
    );
};

export default LinkForm;
