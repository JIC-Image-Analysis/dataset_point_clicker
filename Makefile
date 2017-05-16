all: build/index.html build/app.js

build/index.html: 
	cp quadrilateral_point_picker.html build/index.html

build/app.js: build/pre_app.js check-env
	sed s/localhost/$(DSERVE_HOSTNAME)/ < build/pre_app.js > build/app.js
	rm build/pre_*

build/pre_app.js: quadrilateral_point_picker.ts
	tsc

check-env:
ifndef DSERVE_HOSTNAME
	$(error DSERVE_HOSTNAME is undefined)
endif

clean:
	rm build/*
