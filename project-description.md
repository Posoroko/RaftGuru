Raft Guru

a simple app to help me in my work as a life raft servicing technician.

Each morning and afternoon we service between 5 and 11 life rafts.
Each raft needs to be inflated and tested for correct pressure. So we juggle with a bunch of 
times like 10:45, 11:35, 11:50 ... it's quite hard to remember all of them
and we spend a lot of time walking around to check on deadlines on the servicing sheet
next to the rafts.

So I want to build an app that keeps track of each raft.


service routine example:

inflate ar 13:00
1st pressure mesure at 13:30
second mesure at 14:30

if first mesure is bad, we replace the valves and reset the routine.

new inflate at 13:30
new first at 14:00
new second at 15:00

all rafts are opened on a rectangular soft floor. If I could simply check my phone to know what raft needs to be mesured instead of going around, it would be much easier and les distracting.  I always walk around and I keep forgetting the times...


the goal is to have a very simple app that show the rectangular floor in full screen on the phone. the area is divided in a 3x5 grid representing the places where rafts can be located.

click on a tile, it opens a modal.
modal proposes to start a new test. now ? custome time ?
click now.
the tile displays the time of the next mesure.

when the time is reached, app plays an alarm (optional) and the tile flashes a red border (something along those lines)
I take the mesure, I click on the tile , a new modal opens, 1st mesure valid?
click yes, 
the tile now shows the second mesure deadline.

first mesure valid ? 
click no.
Start a new test now ? custom time ?
click now

test is reseted, new time is displayed.
