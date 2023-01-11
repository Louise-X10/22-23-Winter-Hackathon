# 22-23 Winter Hackathon

- `bouncing-balls`: Bouncing balls web simulation with self-implemented physics
- `compound-interest`: Compount Interest Calculator
- `poker`: Texas hold'em poker game (currently single-player only)

## Bouncing balls
25 balls of random size, color, velocity are created. Use `AWSD` to move the Evilball (transparent with white border) and eat the other balls. A total ball count is kept on the upper right corner of the page. 

P.S. When two balls collide, they bounce off each other and both change to another random color. 

## Compound interest calculator
Calculator with 4 input fields: primary amount, interest rate, time cycle, final amount. Given any 3 of the 4 fields, the calculator can compute the remaining field. More detailed instructions are given on the webpage. 

## Poker (In progress)
- Completed 
  - Card flips
  - Table Setup
  - Token Movement
  - Evaluate poker hand ranking
  - Animate Token Movement
  - Two-player: take turns 
  - Two-player: Setup server
  - Two-player: Compare evaluations and declare winner
  - Two-player: Move tokens to winner
- Woking on
  - Two-player: Split tokens evenly for ties
- To be completed
  - Multiplayer: big bind, small bind
  - Multiplayer: match betting
  - Refine multiple token movement (animate different target positions), adjust delay
  - Reorganize token method