#!/usr/bin/env python3
"""
Undo the image wiring. Strips every line containing data-img-wired="true"
from every HTML file in this folder, and removes any has-hero-* class
that was added.

Does NOT delete images.css or the images/ folder — you can do that
manually if you want to keep the option open.

Run with:
    cd "/Users/gbrew/Desktop/independent front/independent front/site"
    python3 unwire-images.py
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))

n_files = 0
n_lines = 0
n_classes = 0

for fname in sorted(os.listdir(HERE)):
    if not fname.endswith('.html'): continue
    path = os.path.join(HERE, fname)
    src = open(path, encoding='utf-8').read()
    original = src

    # 1. Drop every line that contains the wiring marker
    new_lines = []
    for line in src.splitlines(keepends=True):
        if 'data-img-wired="true"' in line:
            n_lines += 1
            continue
        new_lines.append(line)
    src = ''.join(new_lines)

    # 2. Strip has-hero-* classes left behind on body tags
    def _strip_hero(m):
        nonlocal n_classes
        classes = m.group(1)
        new = re.sub(r'\bhas-hero-[a-z]+\b', '', classes).strip()
        new = re.sub(r'\s+', ' ', new)
        if new:
            n_classes += 1
            return f'<body class="{new}">'
        n_classes += 1
        return '<body>'
    src = re.sub(r'<body class="([^"]*)">', _strip_hero, src, count=1)

    if src != original:
        open(path, 'w', encoding='utf-8').write(src)
        n_files += 1

print(f'Stripped {n_lines} wiring line(s) and {n_classes} body class(es) across {n_files} file(s).')
print('Site is back to its plain-typography state.')
print('Images and images.css were left in place. Delete them manually if you want them gone.')
