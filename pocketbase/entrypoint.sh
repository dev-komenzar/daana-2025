#!/bin/sh
# Volume mount is root-owned; fix ownership before dropping privileges.
chown -R pb:pb /pb/pb_data
exec su-exec pb /pb/pocketbase "$@"
