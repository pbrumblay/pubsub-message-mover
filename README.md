# pubsub-message-mover

Moves messages from a source (pull) subscription to a target topic.

## Commander CLI:
```
$ node app.js --help
Usage: app [options]

Options:
  -s, --sourcesubscription <sub name>  Source subscription to pull messages from.
  -t, --targettopic <topic name>       Target topic to move messages to.
  -sp, --subproject <project>          Name of project where subscription is defined.
  -tp, --topicproject <project>        Name of project where topic is defined.
  -n, --nummessages <number>           Number of messages to move at a time. (default: 100)
  -tm, --total <number>                Total number of messages to move. This real sum of the moved messages should be a maximum of total + nummessages. (default: 100)
  -h, --help                           display help for command
```

## Examples

Move at least 20000 messages from test-deadletter-subscription to test-topic. Try to pull (roughly) 1000 at a time.
```
node app.js -s test-deadletter-subscription -t test-topic -sp my-gcp-project -tp my-gcp-project -n 1000 -tm 20000
```
