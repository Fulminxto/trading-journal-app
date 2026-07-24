"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Check } from "lucide-react";

type FilterOption = {
  label: string;
  value: string;
};

type DiaryFilterSelectProps = {
  name: string;
  defaultValue: string;
  options: FilterOption[];
  className?: string;
};

export default function DiaryFilterSelect({
  name,
  defaultValue,
  options,
  className = "",
}: DiaryFilterSelectProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((option) => option.value === defaultValue))
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const activeOption = optionRefs.current[activeIndex];
    activeOption?.focus();
    activeOption?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const openAtSelectedOption = (direction: "current" | "previous" = "current") => {
    const selectedIndex = Math.max(
      0,
      options.findIndex((option) => option.value === value)
    );
    setActiveIndex(
      direction === "previous"
        ? Math.max(0, selectedIndex - 1)
        : selectedIndex
    );
    setOpen(true);
  };

  const selectOption = (option: FilterOption) => {
    setValue(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openAtSelectedOption(event.key === "ArrowUp" ? "previous" : "current");
    }
  };

  const handleListboxKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      if (event.key === "Escape") {
        event.preventDefault();
        triggerRef.current?.focus();
      }
      return;
    }

    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Home" ||
      event.key === "End"
    ) {
      event.preventDefault();
      if (event.key === "Home") {
        setActiveIndex(0);
      } else if (event.key === "End") {
        setActiveIndex(options.length - 1);
      } else {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex(
          (current) => (current + direction + options.length) % options.length
        );
      }
    }
  };

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`.trim()}>
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (open) setOpen(false);
          else openAtSelectedOption();
        }}
        onKeyDown={handleTriggerKeyDown}
        className="diary-compact-select h-9 w-auto shrink-0 cursor-pointer rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 px-3 py-1.5 text-left text-xs text-white outline-none transition-colors duration-base focus:border-accent-bright/50"
      >
        <span className="block truncate">{selectedOption?.label}</span>
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={name}
          onKeyDown={handleListboxKeyDown}
          className="absolute left-0 top-full z-50 mt-1 max-h-56 min-w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0b1329]/95 p-1 shadow-2xl backdrop-blur-xl [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5 hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={activeIndex === index ? 0 : -1}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
                className={`flex w-full cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-left text-xs outline-none transition-all hover:bg-cyan-500/10 hover:text-cyan-400 focus-visible:bg-cyan-500/10 focus-visible:text-cyan-400 ${
                  selected
                    ? "bg-cyan-500/10 font-medium text-cyan-400"
                    : "text-slate-300"
                }`}
              >
                <span>{option.label}</span>
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                  {selected && (
                    <Check
                      className="h-3.5 w-3.5 text-cyan-400"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
