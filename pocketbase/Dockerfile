FROM alpine:3.20 AS downloader

ARG PB_VERSION=0.22.21
ARG TARGETARCH=amd64

RUN apk add --no-cache ca-certificates unzip wget \
	&& wget -O /tmp/pb.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip" \
	&& unzip /tmp/pb.zip -d /pb \
	&& chmod +x /pb/pocketbase \
	&& rm /tmp/pb.zip

FROM alpine:3.20

RUN apk add --no-cache ca-certificates su-exec tzdata wget \
	&& addgroup -S pb && adduser -S pb -G pb

WORKDIR /pb
COPY --from=downloader /pb/pocketbase /pb/pocketbase
COPY pb_migrations /pb/pb_migrations
COPY pb_hooks /pb/pb_hooks
COPY entrypoint.sh /entrypoint.sh

RUN mkdir -p pb_data && chown -R pb:pb /pb \
	&& chmod +x /entrypoint.sh

EXPOSE 8090

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
	CMD wget -qO- http://127.0.0.1:8090/api/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["serve", "--http=0.0.0.0:8090"]
