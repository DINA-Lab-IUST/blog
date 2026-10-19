// ─── Code copy buttons (client) ─────────────────────────────────────────────
// The label is always English: code stays LTR in every language, so its copy
// affordance must not follow the chrome language.

const COPY_LABEL = 'copy';
const COPIED_LABEL = 'copied';

/** Wrapper that owns the button so it never scrolls together with the code. */
const FRAME_CLASS = 'code-frame';

/** Copyable text of a block: its <code> child, or its raw text nodes. */
function blockText(pre: HTMLElement): string {
  const code = pre.querySelector('code');
  if (code) return code.innerText ?? code.textContent ?? '';
  return Array.from(pre.childNodes)
    .map((node) => node.textContent ?? '')
    .join('');
}

/**
 * Wrap one <pre> in a non-scrolling frame and pin a copy button to the frame's
 * top-right corner.
 *
 * The button must NOT live inside the <pre>. A <pre> scrolls horizontally, and
 * every descendant of a scroller travels with the content — so on a phone the
 * button slid away with the code and ended up sitting in the middle of the
 * text. The frame itself never scrolls, so the button stays pinned while the
 * code scrolls inside it.
 */
export function addCopyButton(pre: HTMLElement, ariaLabel: string = COPY_LABEL): void {
  if (pre.parentElement?.classList.contains(FRAME_CLASS)) return;

  const frame = document.createElement('div');
  frame.className = FRAME_CLASS;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-btn';
  btn.textContent = COPY_LABEL;
  btn.setAttribute('aria-label', ariaLabel);
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(blockText(pre));
    } catch {
      return;
    }
    btn.textContent = COPIED_LABEL;
    setTimeout(() => {
      btn.textContent = COPY_LABEL;
    }, 2000);
  });

  pre.replaceWith(frame);
  frame.append(pre, btn);
}

/** Add a copy button to every code block matching `selector` inside `root`. */
export function addCopyButtons(root: ParentNode, selector: string): void {
  root.querySelectorAll<HTMLElement>(selector).forEach((pre) => addCopyButton(pre));
}
