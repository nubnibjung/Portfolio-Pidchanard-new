import { useCallback, useEffect, useRef, useState } from 'react';
import { achievements, education, experiences, profile, projects, skills } from '../data/portfolio.js';
import { scrollToTarget, setScrollLocked } from '../hooks/useSmoothScroll.js';
import { engageHyperdrive } from '../webgl/scrollState.js';

export const OPEN_TERMINAL_EVENT = 'pm:terminal';

export function openTerminal() {
  window.dispatchEvent(new CustomEvent(OPEN_TERMINAL_EVENT));
}

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
const SECTIONS = ['hero', 'about', 'experience', 'skills', 'projects', 'achievements', 'contact'];
const SECTION_ALIASES = { home: 'hero', top: 'hero', work: 'experience', stack: 'skills', awards: 'achievements' };
const HOST = `${profile.name.toLowerCase()}.dev`;

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const HELP = [
  ['help', 'show this list'],
  ['whoami', 'who is this'],
  ['about', 'short bio'],
  ['work', 'experience timeline'],
  ['projects', 'list projects  ·  open <slug>'],
  ['skills', 'the stack'],
  ['awards', 'competitions & milestones'],
  ['education', 'where I studied'],
  ['contact', 'ways to reach me'],
  ['cv', 'download my resume'],
  ['goto <section>', 'scroll to a section'],
  ['hyperdrive', '↑↑↓↓←→←→BA also works'],
  ['clear / exit', ''],
];

// Tappable shortcuts for touch devices, where typing commands is awkward.
const QUICK_COMMANDS = ['help', 'whoami', 'projects', 'skills', 'contact', 'hyperdrive', 'clear'];

const COMMANDS = ['help', 'whoami', 'about', 'work', 'projects', 'open', 'skills', 'awards', 'education', 'contact', 'cv', 'goto', 'hyperdrive', 'clear', 'exit', 'sudo'];

const line = (text, kind = 'out') => ({ kind, text });
// Two-column output; rendered as a grid so wrapped text stays in its column on narrow screens.
const row = (left, right, kind = 'out') => ({ kind, text: right, left });
const isTouch = () => window.matchMedia('(hover: none)').matches;

// Drawn with a CSS border rather than box-drawing characters, which fall back to a
// different-width font and leave the right edge ragged.
const BANNER = line('', 'banner');

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([BANNER]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [toast, setToast] = useState(false);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const lastListedRef = useRef(null);

  const print = useCallback((...next) => setLines((current) => [...current, ...next]), []);

  const hyperdrive = useCallback(() => {
    engageHyperdrive();
    setToast(true);
  }, []);

  // Keyboard shortcuts: ` or Ctrl/⌘+K toggles, Esc closes, Konami code anywhere triggers hyperdrive.
  useEffect(() => {
    let keys = [];
    const onKeyDown = (event) => {
      const typing = event.target.closest?.('input, textarea, [contenteditable]');
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '`' && !typing)) {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (event.key === 'Escape') setOpen(false);
      if (typing) return;
      keys = [...keys, event.key.toLowerCase()].slice(-KONAMI.length);
      if (keys.join() === KONAMI.join()) {
        keys = [];
        hyperdrive();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_TERMINAL_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_TERMINAL_EVENT, onOpen);
    };
  }, [hyperdrive]);

  useEffect(() => {
    setScrollLocked(open);
    if (open && !isTouch()) window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => setScrollLocked(false);
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(false), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const goto = (id) => {
    setOpen(false);
    window.setTimeout(() => scrollToTarget(`#${id}`), 250);
  };

  const run = (raw) => {
    const commandLine = raw.trim();
    print(line(commandLine, 'in'));
    if (!commandLine) return;
    setHistory((current) => [commandLine, ...current].slice(0, 50));
    setHistoryIndex(-1);

    if (commandLine !== 'help') lastListedRef.current = null;
    const [command, ...args] = commandLine.split(/\s+/);
    const arg = args.join(' ').toLowerCase();

    switch (command.toLowerCase()) {
      case 'help':
        print(...HELP.map(([name, desc]) => row(name, desc)));
        break;
      case 'whoami':
        print(line(`${profile.name} ${profile.surname} — ${profile.role}`), line(`📍 ${profile.location}`, 'muted'));
        break;
      case 'about':
        print(line(profile.summary));
        break;
      case 'work':
        experiences.forEach((job) => {
          print(row(job.date, `${job.title} @ ${job.company}`), row('', job.tags.join(' · '), 'muted'));
        });
        break;
      case 'projects':
        projects.forEach((project) => {
          print(row(slugify(project.title), `${project.year}  ${project.tech.join(', ')}`));
        });
        print(line('type `open <slug>` to visit one', 'muted'));
        break;
      case 'open': {
        const project = projects.find((item) => slugify(item.title) === slugify(arg));
        if (!project) {
          print(line(`open: no project "${arg}". try \`projects\``, 'err'));
          break;
        }
        print(line(`opening ${project.title} ↗`, 'accent'));
        window.open(project.links[0].href, '_blank', 'noopener');
        break;
      }
      case 'skills':
      case 'stack':
        skills.forEach((group) => print(row(group.title, group.items.join(', '))));
        break;
      case 'awards':
        achievements.forEach((item) => print(row(item.date, item.title)));
        break;
      case 'education':
        print(line(education.school), line(`${education.degree} · ${education.period}`, 'muted'), line(education.description, 'muted'));
        break;
      case 'contact':
        print(
          line(`email     ${profile.email}`),
          line(`github    ${profile.githubUrl}`),
          line(`linkedin  ${profile.linkedinUrl}`),
        );
        break;
      case 'cv':
      case 'resume': {
        const link = document.createElement('a');
        link.href = profile.resumeUrl;
        link.download = profile.resumeFileName;
        link.click();
        print(line(`downloading ${profile.resumeFileName} ↓`, 'accent'));
        break;
      }
      case 'goto': {
        const id = SECTION_ALIASES[arg] ?? arg;
        if (!SECTIONS.includes(id)) {
          print(line(`goto: unknown section "${arg}". try: ${['home', 'about', 'work', 'stack', 'projects', 'awards', 'contact'].join(', ')}`, 'err'));
          break;
        }
        goto(id);
        break;
      }
      case 'hyperdrive':
        print(line('⚡ engaging hyperdrive…', 'accent'));
        hyperdrive();
        break;
      case 'sudo':
        print(line('nice try 😄 permission denied', 'err'));
        break;
      case 'clear':
        setLines([]);
        break;
      case 'exit':
        setOpen(false);
        break;
      default:
        print(line(`command not found: ${command}. type \`help\``, 'err'));
    }
  };

  // Lists the options for the current input once; pressing Tab again without typing doesn't repeat it.
  const showOptions = (matches) => {
    if (lastListedRef.current === input) return;
    lastListedRef.current = input;
    print(line(input, 'in'), line(matches.join('  '), 'muted'));
  };

  const autocomplete = () => {
    // Empty prompt: behave like typing `help`, once.
    if (!input.trim()) {
      if (lastListedRef.current === '') return;
      lastListedRef.current = '';
      run('help');
      return;
    }

    const [command, ...rest] = input.split(' ');
    if (rest.length === 0) {
      const matches = COMMANDS.filter((name) => name.startsWith(command.toLowerCase()));
      if (matches.length === 1) {
        setInput(`${matches[0]} `);
      } else if (matches.length > 1 && lastListedRef.current !== input) {
        // Show matching commands as the same two-column table as `help`.
        lastListedRef.current = input;
        const rows = HELP.filter(([name]) => matches.some((match) => name.split(/[\s/]+/).includes(match)));
        print(line(input, 'in'), ...rows.map(([name, desc]) => row(name, desc)));
      }
      return;
    }
    const options = command === 'open' ? projects.map((p) => slugify(p.title))
      : command === 'goto' ? ['home', 'about', 'work', 'stack', 'projects', 'awards', 'contact'] : [];
    const partial = rest.join(' ').toLowerCase();
    const matches = options.filter((name) => name.startsWith(partial));
    if (matches.length === 1) setInput(`${command} ${matches[0]}`);
    else if (matches.length > 1) showOptions(matches);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      lastListedRef.current = null;
      run(input);
      setInput('');
    } else if (event.key === 'Tab') {
      event.preventDefault();
      autocomplete();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      if (history[next] !== undefined) {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(Math.max(next, -1));
      setInput(next >= 0 ? history[next] : '');
    }
  };

  return (
    <>
      <div className={`terminal-overlay ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden={!open}>
        <div
          className="terminal glass"
          role="dialog"
          aria-label="Terminal"
          onClick={(event) => {
            event.stopPropagation();
            // On touch screens, focusing would pop up the keyboard on every tap (e.g. quick commands).
            if (!isTouch()) inputRef.current?.focus();
          }}
        >
          <div className="terminal-bar">
            <button type="button" className="terminal-dot is-red" aria-label="Close terminal" onClick={() => setOpen(false)} />
            <span className="terminal-dot is-yellow" />
            <span className="terminal-dot is-green" />
            <span className="terminal-title">guest@{HOST} — zsh</span>
            <span className="terminal-hint">esc to close</span>
          </div>
          <div className="terminal-body" ref={bodyRef} data-lenis-prevent>
            {lines.map((item, index) => (item.kind === 'banner' ? (
              <div key={index} className="terminal-banner">
                <p>{HOST}  ·  portfolio</p>
                <p>type `help` · tab to autocomplete</p>
              </div>
            ) : (
              <pre key={index} className={`terminal-line is-${item.kind} ${item.left !== undefined ? 'is-row' : ''}`}>
                {item.kind === 'in' && <span className="terminal-prompt">❯</span>}
                {item.left !== undefined && <span className="terminal-col">{item.left}</span>}
                {item.left !== undefined ? <span>{item.text}</span> : item.text}
              </pre>
            )))}
            <div className="terminal-quick only-touch">
              {QUICK_COMMANDS.map((command) => (
                <button type="button" key={command} onClick={() => run(command)}>{command}</button>
              ))}
            </div>
            <label className="terminal-input">
              <span className="terminal-prompt">❯</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => {
                  lastListedRef.current = null;
                  setInput(event.target.value);
                }}
                onKeyDown={onKeyDown}
                spellCheck="false"
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal command"
                tabIndex={open ? 0 : -1}
              />
            </label>
          </div>
        </div>
      </div>

      <div className={`hyper-toast ${toast ? 'is-visible' : ''}`} aria-live="polite">
        {toast && '⚡ Hyperdrive engaged'}
      </div>
    </>
  );
}
