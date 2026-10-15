#!/bin/sh
set -e

# Run database migrations if enabled (default: true)
if [ "$RUN_MIGRATIONS" != "false" ]; then
  echo "Applying database migrations with Prisma..."
  npx prisma migrate deploy || {
    echo "Warning: Database migrations could not be applied automatically."
  }
fi

# Execute command passed to docker container (defaults to node dist/src/main)
exec "$@"
