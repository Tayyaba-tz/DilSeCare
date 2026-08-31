# Playground Notes

## Modal vs shadcn Dialog

1. **No portal rendering.** My Modal renders at whatever position it sits in the JSX tree. shadcn wraps its content in `<DialogPortal>`, which moves the popup to a completely different place in the DOM, usually near `<body>`. This matters because if any parent element above my Modal has `overflow: hidden` or its own stacking context, my modal can get cut off visually or get hidden behind other elements. A portal avoids this problem entirely.

2. **Duplicate id risk.** I hardcoded `id="modal-title"` as a fixed string. If two Modals ever appear on the page at the same time, both will have the same id, which is invalid HTML and breaks `aria-labelledby` for screen readers. shadcn's `DialogPrimitive.Title` generates a unique id on its own using something like React's `useId`, and connects it to `aria-labelledby` automatically through context. So there is no risk of id collision.

3. **No scroll lock.** While my modal is open, the user can still scroll the page behind it using the mouse wheel or touch. shadcn's Dialog locks body scroll while it is open, which is the standard expected behavior for modals.

4. **No enter/exit animation.** My modal just appears and disappears instantly because of `if (!isOpen) return null`. shadcn's version uses `data-open` and `data-closed` attributes connected to Tailwind animation classes like `fade-in-0` and `zoom-in-95`, so it animates smoothly when opening and closing.

5. **No description, only a label.** shadcn includes a separate `DialogDescription` component connected to `aria-describedby`, so a screen reader can announce both a short title and some extra context. My Modal only has `aria-labelledby` and has no way to support description text.

6. **Monolithic vs composable.** My Modal is a single component that takes a `title` prop and children. shadcn breaks it into many smaller pieces like `Dialog`, `DialogTrigger`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, and `DialogDescription`, which you put together yourself. It is more work to set up, but much more flexible. For example, you can add a footer with action buttons without touching the component's internal code.

7. **Focus trap logic is fully hand-rolled in mine.** I manually query all focusable elements on every keydown event and redirect focus at the first and last element myself. shadcn's focus trap is handled internally by the primitive, and it has probably been tested against many more edge cases than my manual version covers, such as nested focusable widgets or elements that are added and removed dynamically.

---

## Tabs vs shadcn Tabs

1. **No vertical orientation.** shadcn's Tabs accepts an `orientation` prop with `horizontal` or `vertical` options. According to the ARIA APG tabs pattern, vertical tab lists should respond to Up/Down arrow keys instead of Left/Right. My Tabs only handles Left/Right/Home/End and has no concept of orientation at all.

2. **No disabled-tab support.** shadcn's `TabsTrigger` supports a `disabled` state that dims the tab and removes it from keyboard and pointer interaction using `aria-disabled` and `pointer-events-none`. My Tabs has no way to mark an individual tab as unavailable.

3. **Roving tabindex is handled by the primitive, not by me.** I manually track `activeIndex`, calculate new indexes for each arrow key, and call `.focus()` on the correct ref myself. In shadcn, `TabsPrimitive.Tab` manages all of this internally. The roving tabindex pattern is not something the developer has to implement by hand.

4. **Only plain string labels, not flexible content.** My `TabItem` type only allows a plain string as a `label`. shadcn's `TabsTrigger` accepts full JSX children, so a tab can contain an icon with text, a badge, or anything else.

5. **No clear keyboard focus ring.** shadcn's trigger uses `focus-visible:ring-[3px] focus-visible:ring-ring/50`, which shows a visible focus ring specifically for keyboard users through `:focus-visible`. This is separate from the styling of the selected tab. My version only visually highlights the selected tab. A keyboard user navigating to an unselected tab has no strong visual signal that it is focused, especially if another stylesheet on the page overrides the browser's default outline.

6. **Style variants using `cva`.** shadcn uses `class-variance-authority` to define reusable style variants like `default` and `line`. My version has one hardcoded look, controlled with an inline ternary. This works fine for a single use case, but it does not scale well if the same Tabs component needs to look different in different parts of the app.

---

## What I would change in my own components next time

- Add a proper focus trap and portal setup instead of building it manually. At a minimum, I would render the modal using `createPortal` from `react-dom`.
- Generate ids using `React.useId()` instead of hardcoding strings, so multiple instances of the same component never have the same id.
- Add a body scroll lock by setting `overflow: hidden` on `<body>` while the modal is open.
- Support `orientation="vertical"` in Tabs with Up/Down arrow key handling, since the ARIA APG pattern explicitly covers both horizontal and vertical orientations.