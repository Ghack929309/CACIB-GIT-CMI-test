# ToDo

- **Manual History Trigger**: History checks are triggered on FX rate updates. Ideally, they should be debounced or triggered only on significant changes.
- **Simple Override Logic**: The override validation runs on every keystroke.
- **Basic Styling**: Used default Tailwind, shadcn colors and lucide icons.

## Improvements

- [x] Add a visual indicator (up/down arrow) for rate fluctuations.
- [ ] Add chart visualization for historical data.
- [ ] Add debouncing for history additions.
- [ ] Persist history to localStorage.
- [ ] Add unit tests for `useFxRate` and `useConversionHistory`.
