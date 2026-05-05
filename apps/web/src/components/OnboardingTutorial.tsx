import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

export interface OnboardingStep {
  label: string;
  title: string;
  body: string;
  targetSelector: string;
  placement?: "top" | "right" | "bottom" | "left";
  primaryLabel?: string | ((target: HTMLElement | null) => string);
  primaryAction?: "next" | "click-target" | "finish";
  primaryTargetSelector?: string;
  completeOnTargetClick?: boolean;
  completionSelector?: string;
  requireTargetClick?: boolean;
  waitForSelectorBeforeAdvance?: string;
  waitingLabel?: string;
  padding?: number;
}

interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface Point {
  top: number;
  left: number;
}

interface Size {
  width: number;
  height: number;
}

interface OnboardingTutorialProps {
  title: string;
  steps: OnboardingStep[];
  onDismiss: () => void;
  onBeforePrimaryAction?: (step: OnboardingStep) => void;
}

const POPOVER_WIDTH = 360;
const POPOVER_HEIGHT = 260;
const GAP = 18;
const SCROLL_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
  "Spacebar",
]);
type Placement = NonNullable<OnboardingStep["placement"]>;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getPaddedRect(raw: DOMRect, padding: number): Rect {
  const top = clamp(raw.top - padding, 8, window.innerHeight - 16);
  const left = clamp(raw.left - padding, 8, window.innerWidth - 16);
  const right = clamp(raw.right + padding, 16, window.innerWidth - 8);
  const bottom = clamp(raw.bottom + padding, 16, window.innerHeight - 8);

  return {
    top,
    left,
    right,
    bottom,
    width: Math.max(right - left, 0),
    height: Math.max(bottom - top, 0),
  };
}

function isRectOutOfView(rect: DOMRect): boolean {
  return (
    rect.bottom < 24 ||
    rect.top > window.innerHeight - 24 ||
    rect.right < 24 ||
    rect.left > window.innerWidth - 24
  );
}

function eventPathContains(event: Event, element: HTMLElement | null): boolean {
  if (!element) return false;

  const path = event.composedPath();
  if (path.length > 0) {
    return path.includes(element);
  }

  return event.target instanceof Node && element.contains(event.target);
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    target.closest("button, a, input, select, textarea, [role='button']") !== null
  );
}

function getPopoverPoint(
  rect: Rect,
  placement: OnboardingStep["placement"],
  size: Size
): Point {
  const width = Math.min(size.width || POPOVER_WIDTH, window.innerWidth - 32);
  const height = Math.min(size.height || POPOVER_HEIGHT, window.innerHeight - 32);
  const maxLeft = Math.max(16, window.innerWidth - width - 16);
  const maxTop = Math.max(16, window.innerHeight - height - 16);
  const requestedPlacement: Placement = placement ?? "bottom";

  const spaceByPlacement = {
    left: rect.left - 16,
    right: window.innerWidth - rect.right - 16,
    top: rect.top - 16,
    bottom: window.innerHeight - rect.bottom - 16,
  };

  const rawPlacementOrder: Placement[] = [
    requestedPlacement,
    requestedPlacement === "left" ? "right" : "left",
    requestedPlacement === "top" ? "bottom" : "top",
    requestedPlacement === "right" ? "left" : "right",
    requestedPlacement === "bottom" ? "top" : "bottom",
  ];
  const placementOrder = rawPlacementOrder.filter(
    (item, index, list) => list.indexOf(item) === index
  );

  const fits = (candidate: NonNullable<OnboardingStep["placement"]>) => {
    if (candidate === "left" || candidate === "right") {
      return spaceByPlacement[candidate] >= width + GAP;
    }
    return spaceByPlacement[candidate] >= height + GAP;
  };

  const resolvedPlacement =
    placementOrder.find(fits) ??
    placementOrder.reduce((best, candidate) =>
      spaceByPlacement[candidate] > spaceByPlacement[best] ? candidate : best
    );

  if (resolvedPlacement === "left") {
    return {
      left: clamp(rect.left - width - GAP, 16, maxLeft),
      top: clamp(rect.top + rect.height / 2 - height / 2, 16, maxTop),
    };
  }

  if (resolvedPlacement === "right") {
    return {
      left: clamp(rect.right + GAP, 16, maxLeft),
      top: clamp(rect.top + rect.height / 2 - height / 2, 16, maxTop),
    };
  }

  if (resolvedPlacement === "top") {
    return {
      left: clamp(rect.left + rect.width / 2 - width / 2, 16, maxLeft),
      top: clamp(rect.top - height - GAP, 16, maxTop),
    };
  }

  return {
    left: clamp(rect.left + rect.width / 2 - width / 2, 16, maxLeft),
    top: clamp(rect.bottom + GAP, 16, maxTop),
  };
}

export function OnboardingTutorial({
  title,
  steps,
  onDismiss,
  onBeforePrimaryAction,
}: OnboardingTutorialProps) {
  const coachmarkRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [targetStateToken, setTargetStateToken] = useState("");
  const [isWaitingForAdvance, setIsWaitingForAdvance] = useState(false);
  const [coachmarkSize, setCoachmarkSize] = useState<Size>({
    width: POPOVER_WIDTH,
    height: POPOVER_HEIGHT,
  });
  const step = steps[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const progressLabel = `${activeStep + 1} / ${steps.length}`;

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "contain";
    document.body.classList.add("onboarding-tutorial-lock");

    return () => {
      document.body.classList.remove("onboarding-tutorial-lock");
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalOverscroll;
    };
  }, []);

  useEffect(() => {
    const scrollBlockOptions: AddEventListenerOptions = {
      capture: true,
      passive: false,
    };

    const preventWorkspaceScroll = (event: WheelEvent | TouchEvent) => {
      if (eventPathContains(event, coachmarkRef.current)) return;

      event.preventDefault();
      event.stopPropagation();
    };

    const preventWorkspaceKeyScroll = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key)) return;
      if (eventPathContains(event, coachmarkRef.current)) return;
      if (isInteractiveTarget(event.target)) return;

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("wheel", preventWorkspaceScroll, scrollBlockOptions);
    document.addEventListener("touchmove", preventWorkspaceScroll, scrollBlockOptions);
    document.addEventListener("keydown", preventWorkspaceKeyScroll, true);

    return () => {
      document.removeEventListener("wheel", preventWorkspaceScroll, scrollBlockOptions);
      document.removeEventListener("touchmove", preventWorkspaceScroll, scrollBlockOptions);
      document.removeEventListener("keydown", preventWorkspaceKeyScroll, true);
    };
  }, []);

  useEffect(() => {
    const coachmark = coachmarkRef.current;
    if (!coachmark) return;

    const updateCoachmarkSize = () => {
      const rect = coachmark.getBoundingClientRect();
      setCoachmarkSize({
        width: rect.width || POPOVER_WIDTH,
        height: rect.height || POPOVER_HEIGHT,
      });
    };

    updateCoachmarkSize();
    const observer = new ResizeObserver(updateCoachmarkSize);
    observer.observe(coachmark);
    window.addEventListener("resize", updateCoachmarkSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateCoachmarkSize);
    };
  }, [activeStep, step]);

  useEffect(() => {
    setIsWaitingForAdvance(false);
    document
      .querySelectorAll(".onboarding-tutorial__target")
      .forEach((activeTarget) =>
        activeTarget.classList.remove("onboarding-tutorial__target")
      );

    let target: HTMLElement | null = null;
    let didScrollTarget = false;

    const updateTarget = () => {
      if (!target) {
        setTargetRect(null);
        setTargetStateToken("");
        return;
      }

      const rawRect = target.getBoundingClientRect();
      setTargetStateToken(
        [
          target.getAttribute("aria-expanded"),
          target.getAttribute("aria-label"),
          target.getAttribute("title"),
          target.className,
        ].join("|")
      );

      if (isRectOutOfView(rawRect)) {
        target.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: "auto",
        });
        window.setTimeout(updateTarget, 80);
        return;
      }

      setTargetRect(getPaddedRect(rawRect, step.padding ?? 10));
    };

    const activateTarget = () => {
      const nextTarget = document.querySelector<HTMLElement>(step.targetSelector);
      if (!nextTarget) {
        setTargetElement(null);
        setTargetRect(null);
        return;
      }

      if (target !== nextTarget) {
        target?.classList.remove("onboarding-tutorial__target");
        target = nextTarget;
        setTargetElement(nextTarget);
        nextTarget.classList.add("onboarding-tutorial__target");
        didScrollTarget = false;
      }

      if (!didScrollTarget) {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        nextTarget.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
        didScrollTarget = true;
      }

      updateTarget();
    };

    const scheduleTargetRefresh = () => {
      activateTarget();
      window.setTimeout(activateTarget, 80);
      window.setTimeout(activateTarget, 180);
      window.setTimeout(activateTarget, 320);
    };

    const handleTargetInteraction = (event: Event) => {
      if (!target || !(event.target instanceof Node)) return;
      if (!target.contains(event.target)) return;
      scheduleTargetRefresh();
    };

    activateTarget();
    const measureTimer = window.setTimeout(activateTarget, 220);
    const targetObserver = new MutationObserver(activateTarget);
    targetObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["aria-expanded", "aria-label", "class", "title"],
      childList: true,
      subtree: true,
    });

    window.addEventListener("resize", updateTarget);
    window.addEventListener("scroll", activateTarget, true);
    window.addEventListener("transitionend", scheduleTargetRefresh, true);
    document.addEventListener("click", handleTargetInteraction, true);

    return () => {
      document
        .querySelectorAll(".onboarding-tutorial__target")
        .forEach((activeTarget) =>
          activeTarget.classList.remove("onboarding-tutorial__target")
        );
      window.clearTimeout(measureTimer);
      targetObserver.disconnect();
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("scroll", activateTarget, true);
      window.removeEventListener("transitionend", scheduleTargetRefresh, true);
      document.removeEventListener("click", handleTargetInteraction, true);
    };
  }, [step]);

  useEffect(() => {
    if (!isWaitingForAdvance || !step.waitForSelectorBeforeAdvance) return;

    const selector = step.waitForSelectorBeforeAdvance;
    let hasAdvanced = false;
    const completeIfReady = () => {
      if (hasAdvanced) return;
      if (!document.querySelector(selector)) return;

      hasAdvanced = true;
      setIsWaitingForAdvance(false);
      if (isLastStep) {
        onDismiss();
        return;
      }
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    };

    completeIfReady();
    const observer = new MutationObserver(completeIfReady);
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [
    isLastStep,
    isWaitingForAdvance,
    onDismiss,
    step.waitForSelectorBeforeAdvance,
    steps.length,
  ]);

  useEffect(() => {
    if (!step.completeOnTargetClick) return;

    const handleTargetClick = (event: MouseEvent) => {
      if (step.completionSelector) {
        const clickedElement = event.target;
        if (!(clickedElement instanceof Element)) return;
        if (!clickedElement.closest(step.completionSelector)) return;
      } else if (targetElement && event.target instanceof Element) {
        if (!targetElement.contains(event.target)) return;
      } else {
        return;
      }

      if (isLastStep) {
        onDismiss();
        return;
      }
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    };

    document.addEventListener("click", handleTargetClick, true);

    return () => {
      document.removeEventListener("click", handleTargetClick, true);
    };
  }, [
    isLastStep,
    onDismiss,
    step.completeOnTargetClick,
    step.completionSelector,
    steps.length,
    targetElement,
  ]);

  const popoverPoint = useMemo(
    () =>
      targetRect
        ? getPopoverPoint(targetRect, step.placement ?? "bottom", coachmarkSize)
        : {
            left: Math.max(16, window.innerWidth / 2 - coachmarkSize.width / 2),
            top: Math.max(16, window.innerHeight / 2 - coachmarkSize.height / 2),
          },
    [coachmarkSize, step.placement, targetRect]
  );

  function advance() {
    if (isLastStep) {
      onDismiss();
      return;
    }

    setActiveStep((current) => current + 1);
  }

  function handlePrimaryAction() {
    if (step.requireTargetClick) {
      return;
    }

    onBeforePrimaryAction?.(step);

    if (step.primaryAction === "finish") {
      onDismiss();
      return;
    }

    if (step.primaryAction === "click-target") {
      const actionTarget = step.primaryTargetSelector
        ? document.querySelector<HTMLElement>(step.primaryTargetSelector)
        : targetElement;

      if (!actionTarget) {
        if (
          step.waitForSelectorBeforeAdvance &&
          document.querySelector(step.waitForSelectorBeforeAdvance)
        ) {
          advance();
        }
        return;
      }

      actionTarget.click();
      if (step.waitForSelectorBeforeAdvance) {
        if (document.querySelector(step.waitForSelectorBeforeAdvance)) {
          advance();
          return;
        }
        setIsWaitingForAdvance(true);
        return;
      }
      if (!step.completeOnTargetClick) {
        advance();
      }
      return;
    }

    advance();
  }

  const spotlightStyles = targetRect
    ? {
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      }
      : undefined;
  const primaryActionLabel = useMemo(
    () =>
      typeof step.primaryLabel === "function"
        ? step.primaryLabel(targetElement)
        : step.primaryLabel,
    [step.primaryLabel, targetElement, targetStateToken]
  );

  return (
    <div
      className="onboarding-tutorial"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-tutorial-title"
    >
      {targetRect && (
        <>
          <div className="onboarding-tutorial__scrim onboarding-tutorial__scrim--top" style={{ height: targetRect.top }} />
          <div className="onboarding-tutorial__scrim onboarding-tutorial__scrim--bottom" style={{ top: targetRect.bottom }} />
          <div
            className="onboarding-tutorial__scrim onboarding-tutorial__scrim--left"
            style={{ top: targetRect.top, width: targetRect.left, height: targetRect.height }}
          />
          <div
            className="onboarding-tutorial__scrim onboarding-tutorial__scrim--right"
            style={{ top: targetRect.top, left: targetRect.right, height: targetRect.height }}
          />
          <div className="onboarding-tutorial__spotlight" style={spotlightStyles} aria-hidden="true" />
        </>
      )}

      {!targetRect && <div className="onboarding-tutorial__scrim onboarding-tutorial__scrim--full" />}

      <section
        ref={coachmarkRef}
        className="onboarding-tutorial__coachmark"
        style={
          {
            "--tour-popover-left": `${popoverPoint.left}px`,
            "--tour-popover-top": `${popoverPoint.top}px`,
          } as CSSProperties
        }
      >
        <div className="onboarding-tutorial__meta">
          <span>{progressLabel}</span>
          <span>{step.label}</span>
        </div>
        <h2 id="onboarding-tutorial-title">{step.title}</h2>
        <p>{step.body}</p>

        <div className="onboarding-tutorial__progress" aria-label={title}>
          {steps.map((tourStep, index) => (
            <button
              key={tourStep.label}
              type="button"
              className={`onboarding-tutorial__dot${index === activeStep ? " onboarding-tutorial__dot--active" : ""}`}
              onClick={() => setActiveStep(index)}
              aria-label={`Go to ${tourStep.label}`}
              aria-current={index === activeStep ? "step" : undefined}
            />
          ))}
        </div>

        <div className="onboarding-tutorial__actions">
          <button type="button" className="btn btn--outline" onClick={onDismiss}>
            Skip
          </button>
          <button
            type="button"
            className={`btn btn--primary${step.requireTargetClick ? " onboarding-tutorial__required-action" : ""}`}
            onClick={handlePrimaryAction}
            disabled={step.requireTargetClick || isWaitingForAdvance}
            aria-disabled={step.requireTargetClick || isWaitingForAdvance}
          >
            {isWaitingForAdvance
              ? step.waitingLabel ?? "Working"
              : primaryActionLabel ?? (isLastStep ? "Done" : "Next")}
          </button>
        </div>
      </section>
    </div>
  );
}
