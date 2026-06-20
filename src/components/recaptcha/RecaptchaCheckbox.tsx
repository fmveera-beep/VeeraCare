"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { recaptchaEnabled, recaptchaSiteKey } from "@/lib/recaptcha/config";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
    onRecaptchaLoad?: () => void;
  }
}

export type RecaptchaCheckboxRef = {
  getToken: () => string | null;
  reset: () => void;
};

type RecaptchaCheckboxProps = {
  theme?: "light" | "dark";
  className?: string;
};

let scriptRequested = false;
const loadCallbacks: Array<() => void> = [];

function loadRecaptchaScript() {
  if (typeof window === "undefined") return;

  if (window.grecaptcha) {
    window.grecaptcha.ready(() => {
      loadCallbacks.splice(0).forEach((cb) => cb());
    });
    return;
  }

  if (scriptRequested) return;
  scriptRequested = true;

  window.onRecaptchaLoad = () => {
    window.grecaptcha?.ready(() => {
      loadCallbacks.splice(0).forEach((cb) => cb());
    });
  };

  const script = document.createElement("script");
  script.src =
    "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

function whenRecaptchaReady(cb: () => void) {
  if (window.grecaptcha) {
    window.grecaptcha.ready(cb);
    return;
  }
  loadCallbacks.push(cb);
  loadRecaptchaScript();
}

export const RecaptchaCheckbox = forwardRef<
  RecaptchaCheckboxRef,
  RecaptchaCheckboxProps
>(function RecaptchaCheckbox({ theme = "light", className }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const tokenRef = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    getToken: () => {
      if (tokenRef.current) return tokenRef.current;
      if (widgetIdRef.current === null) return null;
      return window.grecaptcha?.getResponse(widgetIdRef.current) || null;
    },
    reset: () => {
      tokenRef.current = null;
      if (widgetIdRef.current !== null) {
        window.grecaptcha?.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    if (!recaptchaEnabled || !containerRef.current) return;

    let cancelled = false;

    whenRecaptchaReady(() => {
      if (cancelled || !containerRef.current || widgetIdRef.current !== null) {
        return;
      }
      widgetIdRef.current = window.grecaptcha!.render(containerRef.current, {
        sitekey: recaptchaSiteKey,
        theme,
        callback: (token) => {
          tokenRef.current = token;
        },
        "expired-callback": () => {
          tokenRef.current = null;
        },
        "error-callback": () => {
          tokenRef.current = null;
        },
      });
    });

    return () => {
      cancelled = true;
      tokenRef.current = null;
      widgetIdRef.current = null;
    };
  }, [theme]);

  if (!recaptchaEnabled) return null;

  return <div ref={containerRef} className={className} />;
});
