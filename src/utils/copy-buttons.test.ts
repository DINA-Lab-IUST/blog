import { beforeEach, describe, expect, it } from 'vitest';

import { addCopyButton, addCopyButtons } from './copy-buttons';

beforeEach(() => {
  document.body.innerHTML = '';
});

function makePre(text = 'const x = 1;'): HTMLElement {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = text;
  pre.appendChild(code);
  document.body.appendChild(pre);
  return pre;
}

describe('copy buttons', () => {
  it('keeps the button OUTSIDE the scrolling <pre>', () => {
    const pre = makePre();
    addCopyButton(pre);

    const frame = pre.parentElement as HTMLElement;
    expect(frame.classList.contains('code-frame')).toBe(true);

    // Regression guard: a button inside the <pre> scrolled away with the code
    // and landed in the middle of the text on narrow screens.
    expect(pre.querySelector('.copy-btn')).toBeNull();
    expect(frame.contains(pre)).toBe(true);
    expect(frame.querySelector('.copy-btn')?.textContent).toBe('copy');
  });

  it('is idempotent', () => {
    const pre = makePre();
    addCopyButton(pre);
    addCopyButton(pre);
    addCopyButton(pre);

    expect(document.querySelectorAll('.code-frame')).toHaveLength(1);
    expect(document.querySelectorAll('.copy-btn')).toHaveLength(1);
  });

  it('decorates every block matching the selector', () => {
    document.body.innerHTML =
      '<div id="c"><pre><code>a</code></pre><pre><code>b</code></pre></div>';

    addCopyButtons(document, '#c pre');

    expect(document.querySelectorAll('#c .code-frame')).toHaveLength(2);
    expect(document.querySelectorAll('#c .copy-btn')).toHaveLength(2);
  });

  it('accepts a custom accessible label', () => {
    const pre = makePre('@article{a}');
    addCopyButton(pre, 'Copy citation');

    const btn = pre.parentElement?.querySelector('.copy-btn');
    expect(btn?.getAttribute('aria-label')).toBe('Copy citation');
    expect(btn?.textContent).toBe('copy');
  });
});
