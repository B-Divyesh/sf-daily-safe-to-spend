# Today Money demo

Open <https://daily-safe-to-spend.sociobot.in/demo> or add `?demo=1` to the home URL.

The demo starts with $1,240 cash, a payday ten days away, three bills, and $250 protected money. One bill is paid and one is overdue. The visible daily amount is $60.

Demo changes use the separate `today-money-demo` IndexedDB database. The real planner uses `today-money`; neither path reads the other database.

Choose **Reset demo** to restore the sample. Choose **Start for real** to clear demo data and open the real planner. Demo data is also cleared whenever in-app navigation leaves demo mode.
