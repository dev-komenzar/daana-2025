FROM alpine:3.20 AS downloader

ARG PB_VERSION=0.22.21
ARG TARGETARCH

RUN apk add --no-cache ca-certificates unzip wget \
	&& case "${TARGETARCH:-amd64}" in \
	amd64) PB_ARCH=amd64 ;; \
	arm64) PB_ARCH=arm64 ;; \
	*) echo "unsupported arch: ${TARGETARCH}" >&2 && exit 1 ;; \
	esac \
	&& wget -O /tmp/pb.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${PB_ARCH}.zip" \
	&& unzip /tmp/pb.zip -d /pb \
	&& chmod +x /pb/pocketbase \
	&& rm /tmp/pb.zip

FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata \
	&& addgroup -S pb && adduser -S pb -G pb

WORKDIR /pb
COPY --from=downloader /pb/pocketbase /pb/pocketbase
COPY pb_migrations /pb/pb_migrations
COPY pb_hooks /pb/pb_hooks

RUN mkdir -p /pb/pb_data && chown -R pb:pb /pb

USER pb

EXPOSE 8090

ENTRYPOINT ["/pb/pocketbase"]
CMD ["serve", "--http=0.0.0.0:8090"]
