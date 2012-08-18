# thief-daemon

core of the thief tdd framework (homemade alternative to buster package)

using websockets for capturing clients, sending test cases and receiving their
response

# start servers

there are 3 simple shell scripts for managing the servers

    $ start
    $ stop
    $ restart

# test case format

    testCase = {
        'name': 'foo',
        'setUp': function () { ... },
        'tearDown': function () { ... },
        'tests': {
            'something to test': function () { ... },
            'yet another thing to test': function () { ... }
        }
    };
