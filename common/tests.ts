import * as test from "tape";
import { calculateDelegateDf } from "./config";

// Launch by ts-node .\node_modules\tape\bin\tape .\tests.ts

test("DF calculation tests", (t) => {
    // delegationDf, numberOfDelegates, leader, expected
    t.equal(calculateDelegateDf(1, 1, true), 1);
    t.equal(calculateDelegateDf(2, 2, true), 1);
    t.equal(calculateDelegateDf(2, 2, false), 1);
    t.equal(calculateDelegateDf(3, 2, true), 2);
    t.equal(calculateDelegateDf(3, 2, false), 1);
    t.equal(calculateDelegateDf(20, 3, true), 10);
    t.equal(calculateDelegateDf(20, 3, false), 5);    
    t.equal(calculateDelegateDf(20, 4, true), 8);
    t.equal(calculateDelegateDf(20, 4, false), 4);   

    t.end();
});