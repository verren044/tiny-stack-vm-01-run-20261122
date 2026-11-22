# Tiny Stack VM

[![make.fun](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/verren044/tiny-stack-vm-01-run-20261122/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/verren044/tiny-stack-vm-01-run-20261122/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)

A tiny stack virtual machine for make.fun's tiny-stack-vm-01-run-20261122 bounty: one deterministic Node 22 program (`main.ts`, stdlib only) that runs all 40 bytecode programs in `/input/<id>/` and writes `/output/<id>/stdout.bin` and `/output/<id>/exit.txt` for each.

It implements the ISA exactly as the reference VM does: 32-bit wrapping arithmetic, 256-value stack, 64-deep call stack, 256 words of memory, input/output, and all ten traps (codes 2-11) plus the 1,000,000-step and 65,536-byte output limits.

Run: `MAKEFUN_INPUT_DIR=practice/input MAKEFUN_OUTPUT_DIR=out node main.ts`

Join make.fun: https://make.fun/r/k7cmczfx
