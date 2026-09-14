import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Every preview is a client component that pulls in its library code.
// Lazy chunks keep a page's JS limited to the previews it actually renders.
export const previews: Record<string, ComponentType> = {
  "motion/button": dynamic(() =>
    import("./motion/button.preview").then((m) => m.ButtonPreview),
  ),
  "motion/tabs": dynamic(() =>
    import("./motion/tabs.preview").then((m) => m.TabsPreview),
  ),
  "motion/select": dynamic(() =>
    import("./motion/select.preview").then((m) => m.SelectPreview),
  ),
  "motion/tooltip": dynamic(() =>
    import("./motion/tooltip.preview").then((m) => m.TooltipPreview),
  ),
  "motion/theme-toggle": dynamic(() =>
    import("./motion/theme-toggle.preview").then((m) => m.ThemeTogglePreview),
  ),
  "motion/range-slider": dynamic(() =>
    import("./motion/range-slider.preview").then((m) => m.RangeSliderPreview),
  ),
  "motion/hold-to-confirm": dynamic(() =>
    import("./motion/hold-to-confirm.preview").then((m) => m.HoldToConfirmPreview),
  ),
  "motion/switch": dynamic(() =>
    import("./motion/switch.preview").then((m) => m.SwitchPreview),
  ),
  "motion/copy-button": dynamic(() =>
    import("./motion/copy-button.preview").then((m) => m.CopyButtonPreview),
  ),
  "motion/toast": dynamic(() =>
    import("./motion/toast.preview").then((m) => m.ToastPreview),
  ),
  "motion/gradient-text": dynamic(() =>
    import("./motion/gradient-text.preview").then((m) => m.GradientTextPreview),
  ),
  "motion/modal": dynamic(() =>
    import("./motion/modal.preview").then((m) => m.ModalPreview),
  ),
  "motion/skeleton": dynamic(() =>
    import("./motion/skeleton.preview").then((m) => m.SkeletonPreview),
  ),
  "motion/accordion": dynamic(() =>
    import("./motion/accordion.preview").then((m) => m.AccordionPreview),
  ),
  "motion/checkbox": dynamic(() =>
    import("./motion/checkbox.preview").then((m) => m.CheckboxPreview),
  ),
  "motion/drawer": dynamic(() =>
    import("./motion/drawer.preview").then((m) => m.DrawerPreview),
  ),
  "motion/input": dynamic(() =>
    import("./motion/input.preview").then((m) => m.InputPreview),
  ),
  "motion/textarea": dynamic(() =>
    import("./motion/textarea.preview").then((m) => m.TextareaPreview),
  ),
  "motion/badge": dynamic(() =>
    import("./motion/badge.preview").then((m) => m.BadgePreview),
  ),
  "motion/progress": dynamic(() =>
    import("./motion/progress.preview").then((m) => m.ProgressPreview),
  ),
  "motion/card": dynamic(() =>
    import("./motion/card.preview").then((m) => m.CardPreview),
  ),
  "motion/avatar": dynamic(() =>
    import("./motion/avatar.preview").then((m) => m.AvatarPreview),
  ),
  "motion/alert": dynamic(() =>
    import("./motion/alert.preview").then((m) => m.AlertPreview),
  ),
  "motion/dropdown-menu": dynamic(() =>
    import("./motion/dropdown-menu.preview").then((m) => m.DropdownMenuPreview),
  ),
  "agents/message-bubble": dynamic(() =>
    import("./motion/message-bubble.preview").then((m) => m.MessageBubblePreview),
  ),
  "agents/agent-loading-states": dynamic(() =>
    import("./motion/agent-loading-states.preview").then((m) => m.AgentLoadingStatesPreview),
  ),
  "agents/todo-list": dynamic(() =>
    import("./motion/todo-list.preview").then((m) => m.TodoListPreview),
  ),
};

export function getPreview(category: string, slug: string) {
  return previews[`${category}/${slug}`];
}
