 GOPATH=$(shell go env GOPATH)

all:
	-go get -u github.com/MoonSHRD/p2chat-android;
	cd $(GOPATH)/src/github.com/MoonSHRD/p2chat-android; \
		go get -v -d ./...; \
		make;
	mv $(GOPATH)/src/github.com/MoonSHRD/p2chat-android/pkg/p2mobile.aar p2mobile.aar;
	mv $(GOPATH)/src/github.com/MoonSHRD/p2chat-android/pkg/p2mobile-sources.jar p2mobile-sources.jar;
