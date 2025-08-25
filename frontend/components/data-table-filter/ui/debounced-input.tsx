import { Input } from "../../ui/input";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "../lib/debounce";

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounceMs = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounceMs?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debouncedOnChange = useCallback(
    (newValue: string | number) => {
      const debouncedFn = debounce((value: string | number) => {
        onChange(value);
      }, debounceMs);
      debouncedFn(newValue);
    },
    [debounceMs, onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedOnChange(newValue);
  };

  return <Input {...props} value={value} onChange={handleChange} />;
}
