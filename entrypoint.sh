#!/bin/sh

echo "run_id: $RUN_ID"
if [ -n "$PROFILE" ]; then
  echo "Running npm test:$PROFILE..."
  npm run "test:$PROFILE"
else
  echo "Running npm test..."
  npm test
fi

npm run report:publish
publish_exit_code=$?

if [ $publish_exit_code -ne 0 ]; then
  echo "failed to publish test results"
  exit $publish_exit_code
fi

# At the end of the test run, if the suite has failed we write a file called 'FAILED'
if [ -f FAILED ]; then
  echo "test suite failed"
  cat ./FAILED
  exit 1
fi

echo "test suite passed"
exit 0
