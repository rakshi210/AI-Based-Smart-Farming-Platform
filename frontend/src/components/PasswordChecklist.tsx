import React from 'react';

export interface PasswordRuleChecks {
  startsWithCapital: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  minLength: boolean;
  noSpaces: boolean;
}

export function evaluatePasswordRules(password: string): PasswordRuleChecks {
  return {
    startsWithCapital: /^[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
    minLength: password.length >= 8,
    noSpaces: password.length > 0 && !/\s/.test(password),
  };
}

interface PasswordChecklistProps {
  password: string;
}

export const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password }) => {
  const rules = evaluatePasswordRules(password);
  const isEmpty = !password || password.length === 0;

  const items = [
    { label: 'First letter is uppercase', met: rules.startsWithCapital },
    { label: 'Contains a lowercase letter', met: rules.hasLowercase },
    { label: 'Contains a number', met: rules.hasNumber },
    { label: 'Contains a special symbol', met: rules.hasSpecial },
    { label: 'Minimum 8 characters', met: rules.minLength },
  ];

  return (
    <div className="mt-2 text-xs space-y-1 py-1.5 px-2 bg-slate-50/80 rounded border border-slate-200/60">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex items-center space-x-1.5 transition-colors ${
            item.met
              ? 'text-emerald-700 font-semibold'
              : isEmpty
              ? 'text-slate-400'
              : 'text-red-500 font-medium'
          }`}
        >
          <span className="w-3.5 text-center select-none font-bold">
            {item.met ? '✓' : isEmpty ? '☐' : '✗'}
          </span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
